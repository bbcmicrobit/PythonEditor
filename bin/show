#!/bin/bash
echo "http://localhost:8000/editor.html"

pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd`
popd > /dev/null

cd ${SCRIPTPATH}/../ && python3 -m http.server
