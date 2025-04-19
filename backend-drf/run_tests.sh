

#!/bin/bash

# Activate venv
source ../env/Scripts/activate

# Run Django tests using pytest
echo "Running Django tests..."
pytest --maxfail=5 --disable-warnings --verbose




