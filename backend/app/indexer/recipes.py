import logging

def get_recipe_by_keyword(cursor, keyword):
    sql = 'getRecipeKeywordSearch'
    try:
        cursor.callproc(sql, (keyword, ))
        return cursor.fetchall()
    except Exception as e:
        print("MYSQL ERROR:", sql)
        logging.error(e)


def get_all_recipes(cursor):
    sql = 'getAllRecipes'
    try:
        cursor.callproc(sql)
        return cursor.fetchall()
    except Exception as e:
        print("MYSQL ERROR:", sql)
        logging.error(e)
