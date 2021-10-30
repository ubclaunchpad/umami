from recipe_scrapers import scrape_me
import json
import re


# json file where the output will be sorted
outfile = open("scraper.json", "w")

# array of urls of recipes
urls = ["https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/",
        "https://tasty.co/recipe/pumpkin-chai-glazed-donuts",
        "https://www.allrecipes.com/recipe/12974/butternut-squash-soup/",
        "https://www.allrecipes.com/recipe/242052/chopped-brussels-sprout-salad/",
        "https://tasty.co/recipe/lasagna-soup"
        ]

# dictionary of recipe
recipe = {
    "example": {
        "recipe_id": "n/a",
        "name": "n/a",
        "created_time": "n/a",
        "user_id": "n/a",
        "protein": "n/a",
        "carbs": "n/a",
        "calories": "n/a",
        "servings": "n/a",
        "vegetarian": "n/a",
        "vegan": "n/a",
        "cooking_time": "n/a"
    },
}

nutrients = {}
ingredients = []
meats = ['Chicken', 'Beef', 'Turkey', 'Sausage', 'Bacon', 'Lamb']
vegetarian = True
vegan = False

for x in urls:
    scraper = scrape_me(x)
    recipename = scraper.title()

    nutrients.update(scraper.nutrients())
    ingredients.append(scraper.ingredients())

    if 'Vegan' in recipename:
        vegetarian = True
        vegan = True
    else:
        for meat in meats:
            if meat in recipename:
                vegetarian = False
                vegan = False
                break
            elif meat in ingredients:
                vegetarian = False
                vegan = False
                break
            else:
                vegetarian = True
                vegan = False

    try:
        protein = float(re.findall("\d+\.\d+", nutrients["proteinContent"])[0])
    except:
        protein = None
    try:
        carbs = float(re.findall("\d+\.\d+", nutrients["carbohydrateContent"])[0])
    except:
        carbs = None
    try:
        cal = float(re.findall("\d+\.\d+", nutrients["calories"])[0])
    except:
        cal = None
    try:
        servings = int(re.findall("\d+", scraper.yields())[0])
    except:
        servings = None

    recipe.update({recipename: {
        'recipe_id': None,
        "name": recipename,
        "created_time": None,
        "user_id": None,
        "carbs": carbs,
        "protein": protein,
        "calories": cal,
        "servings": servings,
        "vegetarian": vegetarian,
        "vegan": vegan,
        "cooking_time": scraper.total_time()}})

json.dump(recipe, outfile, indent = 6)

outfile.close()