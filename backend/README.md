# Backend Notes

## Python Installation Notes

In order to take advantage of some of the tooling for FastAPI, we need to make
sure we have a Python 3.6+ version installed and configured since a lot of
FastAPI's pros come from the optional type hinting feature that was added to
Python in 3.6. If you need to install Python for the first time or need to grab
a newer version, here is the download link for reference:
https://www.python.org/downloads/

On the subject of Python, we are going to use the `venv` module which should
come installed with Python 3. We are also going to use `pip` dependency
installer, which should comes included in Python installations since Python3.4+.

## Setup

For the steps below, we will assume the reader has freshly cloned the repo, has
Python3.6+ installed and configured to run, and is at the root of `umami/`

To start, run the following command in your terminal to create the virtual 
environment:
`cd backend && python -m venv env`

This moves us into the `backend/` folder and creates a folder called `env/`
inside of the `backend/` folder we just moved into. In order to make use of the
virtual environment, we still need to activate it. To do so, run one of the
following commands based on your OS:

MacOS: `source ./env/bin/activate`

Windows: `source ./env/Scripts/activate`

Now, on your command line, we should see `(env)` appear after the command 
prompt to indicate our virtual environment is active. Now when we install 
packages, we will have an easier time running commands or using libraries since
we do not have to worry about another project on our computer containing a
conflicting version of the same package that Python might otherwise try to run 
(assuming our virtual environment is active when running our code).

Next, we are going to run the following command to install the dependencies 
listed in our `requirements.txt` file:

`pip install -r requirements.txt`

Assuming no issues came up while installing the dependencies there, we will try
running our very basic server (at the moment) to test things out:

`cd app && uvicorn app.main:app --reload`

If no error message pops up in our console, we can see our server in action by
going to: `http://localhost:8000/`

To shut down the server, we can just enter `CTRL+C` on the terminal.

To deactivate the virtual environment when we are done using it for running 
our server or installing dependencies, just type `deactivate` into the
terminal. The next command prompt should no longer have `(env)` at the end.

## Running the server

While at `umami/backend/app/` with the virtual environment active, we can 
start up our server in a hot refresh mode with the following command:

`uvicorn app.main:app --reload`

## Seeing the API docs

One of the most exciting parts of FastAPI is being able to see all of the
endpoints we have defined in our code listed out with the associated methods 
like `GET` or `PUT` displayed with them for reference. To do so, just start up 
the server with the previous command and then visit: `http://localhost:8000/docs`

## Ideas for Future Sections

- Testing
- Linting
- Code Review Process
- Docker/Database
- Helpful Resources

## Final Note

This document will be most useful as a living document as things like the
package management tool, file structure, etc. are subject to change. Developers 
are encouraged to update this doc when important changes are made so that 
everyone can benefit from an up-to-date README.

## Docker

### Building image

Inside of the backend folder run the following command to build your docker image.

`docker build -t umami-backend .`

This will create an image with the name umami-backend

### Running container

Inside of the backend folder run the following command to run your docker container 
from the image you built from the previous command.

`docker run -d --name umami-backend-container -p 8080:80 umami-backend`

- `-d` will the run the container in the background
- `--name` Assigns a name to your container
- `-p 80:80` publish ports
    - `8080:80` will publish port 80 within the container to port 8080 on the Docker host 
    - access through localhost:8080
    - [Learn more](https://docs.docker.com/config/containers/container-networking/)

### How To Test Endpoints
1. Delete the `database/data/` folder

2. Run the `docker-compose up` command to build for the `dev` environment

3. Run the following commands either in MySQL Workbench or by connecting to the database on the command line:
```
USE UMAMI_DB;
CALL addMockUser();
CALL addMockMissingMacroRecipe();
CALL addMockSteps();
CALL addMockIngredients();
CALL addMockIngredientsInfo();
```
**Expected Result:** The commands above should run without any errors. If you encounter an error, you may need to remove the Docker containers and/or images manually. In this case, repeat the previous steps.

4. Go to `localhost:8080/docs/`

5. Expand the GET `/recipe/{recipe_id}` endpoint. Click the "Try it out" button and enter the value `1` into the `recipe_id` field.
**Expected Result:** You should receive a response with the form shown by the example value for a 200 response. If all the previous steps worked, this should also work.

6. Repeat step 5. We should get the same result as we did in step 5. This seems redundant but we are actually testing a different pathway in the code. Since we added a recipe with missing macro values, the first call in step 5 handles the case where these macro values are not present in the `recipes_table` and updates the `recipes_table` with the macro values obtained by querying the `ingredients_info_table`. The second time we call the endpoint only needs to query the `recipes_table` since we now have the macro values.
