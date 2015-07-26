ace.define("ace/snippets/python",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.snippetText = "# Module Docstring\n\
snippet docs - create a comment to describe your code\n\
	'''\n\
	${1:# TODO: write some helpful comments here...}\n\
	'''\n\
snippet wh - while some condition is True, keep looping over some code\n\
	while ${1:condition}:\n\
		${2:# TODO: write code...}\n\
snippet with - do stuff with something assigned to a name\n\
	with ${1:something} as ${2:name}:\n\
		${3:# TODO: write code...}\n\
# New Class\n\
snippet cl - create a new class that defines the behaviour of a new type of object\n\
	class ${1:ClassName}(${2:object}):\n\
		\"\"\"${3:docstring for $1}\"\"\"\n\
		def __init__(self, ${4:arg}):\n\
			${5:super($1, self).__init__()}\n\
			self.$4 = $4\n\
			${6}\n\
# New Function\n\
snippet def - define a named function that takes some arguments and optionally add a description\n\
	def ${1:name}(${2:arguments}):\n\
		\"\"\"${3:description for $1}\"\"\"\n\
		${4:# TODO: write code...}\n\
# Ifs\n\
snippet if - if some condition is True, do something\n\
	if ${1:condition}:\n\
		${2:# TODO: write code...}\n\
snippet ei - else if some other condition is True, do something\n\
	elif ${1:condition}:\n\
		${2:# TODO: write code...}\n\
snippet el - else do some other thing\n\
	else:\n\
		${1:# TODO: write code...}\n\
# For\n\
snippet for - for each item in a collection of items do something with each item\n\
	for ${1:item} in ${2:items}:\n\
		${3:# TODO: write code...}\n\
snippet try - try doing something and handle exceptions (errors)\n\
	try:\n\
		${1:# TODO: write code...}\n\
	except ${2:Exception}, ${3:e}:\n\
		${4:raise $3}\n\
";
exports.scope = "python";

});
