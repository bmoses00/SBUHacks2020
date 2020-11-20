#!/usr/bin/python3
import sys
sys.path.insert(0, "/var/www/transparency/")
sys.path.insert(0, "/var/www/transparency/transparency/")

import logging
logging.basicConfig(stream = sys.stderr)

from transparency import app as application
