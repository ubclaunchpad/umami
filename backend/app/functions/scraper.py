from recipe_scrapers import scrape_me
import re

def scraper (url):
    scraper = scrape_me(url, wild_mode=True)
    recipename = scraper.title()
    image = scraper.image()

    recipe = {}
    nutrients = {}
    ingredients = []
    steps = []
    meats = ['Chicken', 'Beef', 'Turkey', 'Sausage', 'Bacon', 'Lamb', "Pork"]
    vegetarian = True
    vegan = False
    pescatarian = False
    gluten_free = False
    dairy_free = False
    keto = False
    paleo = False

    nutrients.update(scraper.nutrients())
    ingredients = scraper.ingredients()
    steps = scraper.instructions().split('\n')

    if 'Vegan' in recipename:
        vegetarian = True
        vegan = True
    else:
        for meat in meats:
            if meat in recipename or meat in ingredients:
                vegetarian = False
                vegan = False
                break

    try:
        protein = float(re.findall("\d+\.\d+", nutrients["proteinContent"])[0])
    except:
        protein = 0
    try:
        carbs = float(re.findall("\d+\.\d+", nutrients["carbohydrateContent"])[0])
    except:
        carbs = 0
    try:
        fat = float(re.findall("\d+\.\d+", nutrients["fatContent"])[0])
    except:
        fat = 0
    try:
        fiber = float(re.findall("\d+\.\d+", nutrients["fiberContent"])[0])
    except:
        fiber = 0
    try:
        cal = float(re.findall("\d+\.\d+", nutrients["calories"])[0])
    except:
        cal = 0
    try:
        servings = int(re.findall("\d+", scraper.yields())[0])
    except:
        servings = 0

    recipe = {
        'recipe_id': None,
        "name": recipename,
        "recipe_description": "A fun auto generated recipe from " + url,
        "created_time": None,
        "user_id": "Qnj6AjQOLoZlJw4TZBpRE3iNz0K3",
        "creator_username": "harinwu",
        "header_image": image,
        "carbs": carbs,
        "protein": protein,
        "fat": fat,
        "fiber": fiber,
        "calories": cal,
        "servings": servings,
        "vegetarian": vegetarian,
        "vegan": vegan,
        "pescatarian": pescatarian,
        "gluten_free": gluten_free,
        "dairy_free": dairy_free,
        "keto": keto,
        "paleo": paleo,
        "cooking_time": scraper.total_time()
    }

    return recipe, steps, ingredients
