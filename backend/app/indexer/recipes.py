import logging
import itertools
from app.functions.transcription import get_recipe_from_video_url

from app.route.pantry import get_all_ingredients

# TODO: should abstract into a function that just takes sql_proc as input
def get_recipe_by_keyword(cursor, keyword):
    sql_proc = 'getRecipeKeywordSearch'
    try:
        cursor.callproc(sql_proc, (keyword, ))
        return cursor.fetchall()
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)


def get_all_recipes(cursor, startIndex, numOnPage):
    sql_proc = 'getRecipePage'
    try:
        cursor.callproc(sql_proc, (startIndex, numOnPage,))
        return cursor.fetchall()
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)

def get_all_recipes_driven(cursor, startIndex, numOnPage, user):
    sql_proc = 'getRecipePageDriven'
    try:
        cursor.callproc(sql_proc, (startIndex, numOnPage, user,))
        return cursor.fetchall()
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)

def get_featured_recipes(cursor):
    sql_proc = 'getFeaturedRecipes'
    try:
        cursor.callproc(sql_proc)
        return cursor.fetchall()
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)

def filter_recipes(cursor, filters):
    vegetarian_result = []
    vegan_result = []
    pescatarian_result = []
    gluten_free_result = []
    dairy_free_result = []
    keto_result = []
    paleo_result = []
    try:
        # returns tuples
        if filters["vegetarian"]:
            vegetarian_result = list(_filter_vegetarian(cursor))
        if filters["vegan"]:
            vegan_result = list(_filter_vegan(cursor))
        if filters["pescatarian"]:
            pescatarian_result = list(_filter_pescatarian(cursor))
        if filters["gluten_free"]:
            gluten_free_result = list(_filter_gluten_free(cursor))
        if filters["dairy_free"]:
            dairy_free_result = list(_filter_dairy_free(cursor))
        if filters["keto"]:
            keto_result = list(_filter_keto(cursor))
        if filters["paleo"]:
            paleo_result = list(_filter_paleo(cursor))

        # assume id is first
        return _filter_duplicates(list(itertools.chain(
            vegetarian_result,
            vegan_result,
            pescatarian_result,
            gluten_free_result,
            dairy_free_result,
            keto_result,
            paleo_result
        )), 0)

    except Exception as e:
        print("MYSQL ERROR:")
        logging.error(e)

def _filter_duplicates(lst, index):
    seen = set()
    ans = []
    for element in lst:
        value = element[index]
        if not value in seen:
            # if we haven't seen this unique identifier we add it to our answer
            # and add it to our set of seen identifiers to not add again
            seen.add(value)
            ans.append(element)
    return ans


def _abstract_recipe_filter(cursor, sql_proc):
    try:
        cursor.callproc(sql_proc, (1,))
        return cursor.fetchall()

    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)
        return []

def _filter_vegetarian(cursor):
    return _abstract_recipe_filter(cursor, 'filterRecipeVegetarian')
    
def _filter_vegan(cursor):
    return _abstract_recipe_filter(cursor, 'filterRecipeVegan')

def _filter_pescatarian(cursor):
    return _abstract_recipe_filter(cursor, 'filterRecipePescatarian')

def _filter_dairy_free(cursor):
    return _abstract_recipe_filter(cursor, 'filterRecipeDairyFree')

def _filter_gluten_free(cursor):
    return _abstract_recipe_filter(cursor, 'filterRecipeGlutenFree')

def _filter_keto(cursor):
    return _abstract_recipe_filter(cursor, 'filterRecipeKeto')

def _filter_paleo(cursor):
    return _abstract_recipe_filter(cursor, 'filterRecipePaleo')

def post_recipe(conn, cursor, recipe):
    sql_proc = 'createRecipeAutoID'

    recipe_id = recipe['recipe_id']
    if (recipe_id):
        sql_proc = 'createRecipe'
    name = recipe['name']
    recipe_description = recipe['recipe_description']
    user_id = recipe['user_id']
    creator_username = recipe['creator_username']
    header_image = recipe.get('header_image', '')
    protein = recipe['protein']
    carbs = recipe['carbs']
    fat = recipe['fat']
    fiber = recipe['fiber']
    calories = recipe['calories']
    servings = recipe['servings']
    vegetarian = recipe['vegetarian']
    vegan = recipe['vegan']
    pescatarian = recipe['pescatarian']
    gluten_free = recipe['gluten_free']
    dairy_free = recipe['dairy_free']
    keto = recipe['keto']
    paleo = recipe['paleo']
    cooking_time = recipe['cooking_time']

    try:
        if (recipe_id):
            finalRecipe = cursor.callproc(sql_proc, (
                recipe_id,
                name,
                recipe_description,
                user_id,
                creator_username,
                header_image,
                protein,
                carbs,
                fat,
                fiber,
                calories,
                servings,
                vegetarian,
                vegan,
                pescatarian,
                gluten_free,
                dairy_free,
                keto,
                paleo,
                cooking_time,
            ))
            conn.commit()
            return finalRecipe
        else:
            finalRecipe = cursor.callproc(sql_proc, (
                name,
                recipe_description,
                user_id,
                creator_username,
                header_image,
                protein,
                carbs,
                fat,
                fiber,
                calories,
                servings,
                vegetarian,
                vegan,
                pescatarian,
                gluten_free,
                dairy_free,
                keto,
                paleo,
                cooking_time,
            ))
            conn.commit()
            cursor.nextset()
            cursor.execute("SELECT * FROM recipes_table ORDER BY created_time DESC LIMIT 1;")
            return cursor.fetchone()
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)

def recipe_from_video_url(url):
    return get_recipe_from_video_url(url)

def post_scrape_steps(conn, cursor, stepList, recipe, ingredients):
    sql_proc = 'addSteps'
    sql_ingredient_proc = 'addIngredients'

    ingredientAdded = False
    try:
        for step in stepList:
            cursor.callproc(sql_proc, (
                recipe,
                step,
                0,
                "",
            ))
            conn.commit()
            cursor.nextset()

            if (not ingredientAdded):
                cursor.execute('SELECT LAST_INSERT_ID()')
                cursor.lastrowid = cursor.fetchone()[0] 
                stepID = cursor.lastrowid
                ingredientAdded = True

                for ingredient in ingredients:
                    res = get_all_ingredients(ingredient)

                    cursor.callproc(sql_ingredient_proc, (
                        res['data'][0][0],
                        recipe,
                        stepID,
                        ingredient,
                        "Other"
                    ))
                    conn.commit()
                    cursor.nextset()
        return stepList
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)

def post_steps(conn, cursor, stepList, recipeID):
    sql_proc = 'addSteps'
    sql_ingredient_proc = 'addIngredients'

    try:
        for step in stepList:
            cursor.callproc(sql_proc, (
                recipeID,
                step["step_text"],
                step["step_time"],
                step["step_image"],
            ))
            conn.commit()
            cursor.nextset()

            cursor.execute('SELECT LAST_INSERT_ID()')
            cursor.lastrowid = cursor.fetchone()[0] 
            stepID = cursor.lastrowid

            for ingredient in step["step_ingredients"]:
                res = get_all_ingredients(ingredient)

                cursor.callproc(sql_ingredient_proc, (
                    res['data'][0][0],
                    recipeID,
                    stepID,
                    ingredient,
                    "Other"
                ))
                conn.commit()
                cursor.nextset()
        return stepList
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)

def is_missing_macros(recipe_details):
    '''
    Returns False if we do not have any macro information
    from the recipe details. Otherwise returns True
    '''
    return not (
        recipe_details["protein"] or
        recipe_details["carbs"] or
        recipe_details["fat"] or
        recipe_details["fiber"] or
        recipe_details["calories"]
    )

def get_ingredient_macros(conn, cursor, ingredients):
    '''
    Returns the macro values for each ingredient
    '''
    sql = 'getIngredientInfo'
    ingredient_macros = []
    cursor.close()
    new_cursor = conn.cursor()
    for ingredient in ingredients:
        try:
            new_cursor.close()
            new_cursor = conn.cursor()
            new_cursor.callproc(sql, (ingredient["ingredient_id"], ))
            raw_result = new_cursor.fetchall()
            res = {
                "ingredient_id": ingredient["ingredient_id"],
                "protein": raw_result[0][4],
                "carbs": raw_result[0][5],
                "fat": raw_result[0][6],
                "fiber": raw_result[0][7],
                "calories": raw_result[0][8]
            }
            ingredient_macros.append(res)
        except Exception as e:
            print("MYSQL ERROR:", sql)
            logging.error(e)
    
    new_cursor.close()
    return ingredient_macros

def get_recipe_by_id(conn, cursor, recipe_id):
    '''
    Returns the available recipe details given a recipe_id
    Note: macros may still be empty if they were not added
    to the recipe or corresponding ingredients
    '''
    sql = 'getRecipe'
    try:
        cursor.callproc(sql, (recipe_id, ))
        raw_result = cursor.fetchall()
        res = {
            "recipe_id": recipe_id,
            "name": "",
            "recipe_description": "",
            "created_time": None,
            "user_id": "",
            "creator_username": "",
            "header_image": "",
            "protein": 0,
            "carbs": 0,
            "fat": 0,
            "fiber": 0,
            "calories": 0,
            "servings": 0,
            "vegetarian": False,
            "vegan": False,
            "pescatarian": False,
            "gluten_free": False,
            "dairy_free": False,
            "keto": False,
            "paleo": False,
            "cooking_time": 0,
            "steps": [],
            "ingredients": []
        }

        if len(raw_result):
            res["name"] = raw_result[0][1]
            res["recipe_description"] = raw_result[0][2]
            res["created_time"] = raw_result[0][3]
            res["user_id"] = raw_result[0][4]
            res["creator_username"] = raw_result[0][5]
            res["header_image"] = raw_result[0][6]
            res["protein"] = raw_result[0][7]
            res["carbs"] = raw_result[0][8]
            res["fat"] = raw_result[0][9]
            res["fiber"] = raw_result[0][10]
            res["calories"] = raw_result[0][11]
            res["servings"] = raw_result[0][12]
            res["vegetarian"] = bool(raw_result[0][13])
            res["vegan"] = bool(raw_result[0][14])
            res["pescatarian"] = bool(raw_result[0][15])
            res["gluten_free"] = bool(raw_result[0][16])
            res["dairy_free"] = bool(raw_result[0][17])
            res["keto"] = bool(raw_result[0][18])
            res["paleo"] = bool(raw_result[0][19])
            res["cooking_time"] = raw_result[0][20]

            step_ids = set()
            ingredient_ids = set()

            for result in raw_result:
                if (result[21]) and (result[21] not in step_ids):
                    res["steps"].append(
                        {
                            "step_id": result[21],
                            "description": result[23],
                            "time": result[24],
                            "header_image": result[25],
                        }
                    )
                    step_ids.add(result[21])

                if (result[26]) and (result[26] not in ingredient_ids):
                    res["ingredients"].append(
                        {
                            "ingredient_id": result[26],
                            "ingredient_name": result[27],
                            "category": result[28],
                            "step_id": result[29]
                        }
                    )
                    ingredient_ids.add(result[26])
            
            res["steps"] = sorted(res["steps"], key=lambda step: step["step_id"])
            res["ingredients"] = sorted(res["ingredients"], key=lambda ingredient: ingredient["ingredient_id"])

            if is_missing_macros(res):
                ingredient_macros = get_ingredient_macros(conn, cursor, res["ingredients"])

                # Make sure the values for macros are not None so we can
                # add, and to fit our model
                res["protein"] = 0
                res["carbs"] = 0
                res["fat"] = 0
                res["fiber"] = 0
                res["calories"] = 0

                # Do something with the macros, assuming they do not
                # need to be scaled, i.e. they have proper macro values
                # according to the recipe
                for ingredient_macro in ingredient_macros:
                    res["protein"] += ingredient_macro["protein"]
                    res["carbs"] += ingredient_macro["carbs"]
                    res["fat"] += ingredient_macro["fat"]
                    res["fiber"] += ingredient_macro["fiber"]
                    res["calories"] += ingredient_macro["calories"]

                # update recipe macros so we don't need to repeat this
                # multiple times for the same recipe
                cursor.close()
                new_cursor = conn.cursor()
                new_sql = 'updateRecipeMacros'
                new_cursor.callproc(new_sql, 
                    (
                        res["recipe_id"], 
                        res["protein"],
                        res["carbs"],
                        res["fat"],
                        res["fiber"],
                        res["calories"]
                    )
                )
                conn.commit()
                
        return res
    except Exception as e:
        print("MYSQL ERROR:", sql)
        logging.error(e)

def get_createdrecipe_by_userid(cursor, user_id):
    sql_proc = 'getCreatedRecipeById'
    try:
        cursor.callproc(sql_proc, (user_id, ))
        return cursor.fetchall()
    except Exception as e:
        print("MYSQL ERROR:", sql_proc)
        logging.error(e)

def delete_recipe_by_id(conn, cursor, recipe_id):
    sql = 'deleteRecipe'
    try:
        cursor.callproc(sql, (recipe_id, ))
        conn.commit()
    except Exception as e:
        print("MYSQL ERROR:", sql)
        logging.error(e)

def soft_delete_recipe_by_id(conn, cursor, recipe_id):
    sql = 'softDeleteRecipe'
    try:
        cursor.callproc(sql, (recipe_id, ))
        conn.commit()
    except Exception as e:
        print("MYSQL ERROR:", sql)
        logging.error(e)
