#!/bin/bash
echo "http://localhost:8000/editor.html"
py -m http.server --bind 0.0.0.0
