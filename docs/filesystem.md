# Filesystem

The filesystem functionality is provided by the [microbitFs](https://github.com/microbit-foundation/microbit-fs/)
library.

More info can be found in the [microbitFs documentation](https://microbit-foundation.github.io/microbit-fs/).

## Modules

During early testing of the filesystem functionality we received feedback
about the process of adding modules to the editor. It was quite easy to
mistakenly add a module to the code editor instead of the filesystem.

Without having a pre-learned context of what is a module and how it differs
from a normal Python file, it can be difficult for users to know that they need
to follow a different process to load modules vs their normal Python scripts.

To overcome this issue we've introduced the use of a "magic comment" (similar
to a [shebang](https://en.wikipedia.org/wiki/Shebang_(Unix))), to identify 
modules and load them directly to the filesystem.

### Magic comment

The term "magic comment" is used following the example set by
[PEP 263 - Defining Python Source Code Encodings](https://www.python.org/dev/peps/pep-0263/).

For a module of name `foo` at version `v1.2.3` the format is as follows:

```python
# microbit-module: foo@1.2.3
```

Rules:
- Magic Comment must one of the first 3 lines of the file and cannot
  contain any Python statements beforehand
    * This allows the module to still have a Python shebang and encoding magic
      comment
    * Only comments starting with a `#` are accepted before this magic comment
- The line must start with a `#` character and must be followed by a space
    * This is in accordance to PEP8: https://www.python.org/dev/peps/pep-0008/#comments
- There must be a space between `microbit-module:` and the module name
- The delimiter character between the module name and the version must be a `@`
- The version must follow [Semver v2.0.0](https://semver.org/spec/v2.0.0.html)
- The module name must follow the same rules as PEP8 Python modules: https://www.python.org/dev/peps/pep-0008/#package-and-module-names
- The module name must follow the Python 2 identifier rules: https://docs.python.org/2/reference/lexical_analysis.html#grammar-token-identifier
    - We chose the Python 2 rules for simplicity, as the [Python 3 rules](https://docs.python.org/3.5/reference/lexical_analysis.html#grammar-token-identifier)
      enable a wide range of characters outside ASCII range.
