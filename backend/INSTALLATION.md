# II. Backend Server Installation Guide

## Prerequisites

Ensure you have Python 3.11 or newer installed on your system. Download Python from [the official website](https://www.python.org/downloads/).

Also make sure you are in the correct `backend` directory :

```
cd backend
```

## Setting Up a Virtual Environment

A virtual environment is a self-contained directory that contains a Python installation for a particular version of Python, plus a number of additional packages. Creating a virtual environment allows you to manage dependencies for a specific project without affecting global Python packages.

1. **Make sure you are in the backend directory** in your current terminal.

2. **Create the virtual environment** by running:

    ```
    python -m venv venv
    ```

    This command creates a new directory called `venv` in your project directory, which contains a fresh Python installation. Feel free to replace `venv` with another name for your virtual environment directory if desired.

3. **Activate the virtual environment**:

    - On **Windows**, run:

        ```
        .\venv\Scripts\activate
        ```

    - On **macOS and Linux**, run:

        ```
        source venv/bin/activate
        ```

    After activation, your command line will show the name of the virtual environment. From now on, any Python or pip commands you run will use the versions in the virtual environment, not the global ones.

## Installing Dependencies

With the virtual environment activated, install the required packages listed in the `requirements.txt` file:

```
pip install -r requirements.txt
```

## Running the Project

Once the data set is extracted and dependencies are installed, you are ready to run the main Python file and get the server up and running.

```
python main.py
```

## Deactivating the Virtual Environment

When you're done working on the project, you can deactivate the virtual environment by running:

```
deactivate
```

This command returns you to the system's global Python installation.

## Troubleshooting

If you encounter any issues during installation, ensure you have the latest version of `pip` and `setuptools` installed in your virtual environment:

```
pip install --upgrade pip setuptools
```
