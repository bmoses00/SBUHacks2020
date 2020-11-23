#!/usr/bin/python3
import sys
sys.path.insert(0, "/var/www/personal_site")
sys.path.insert(0, "/var/www/personal_site/personal_site")

import logging
logging.basicConfig(stream = sys.stderr)

from personal_site import app as application
