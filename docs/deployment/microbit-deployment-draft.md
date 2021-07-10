# Python deployment on python.microbit.org

This spec outlines how python.microbit.org will become the primary web-hosted editor for Micropython micro:bit programming, deprecating what is at microbit.co.uk. 

It also includes a mechanism to make the same editor available to users offline, so that they can have a familiar environment when working without an internet connection.

## Versioning

In order to balance the requirements of stability required by teachers and people producing printed materials and books, with a desire to ensure the latest features are available to advanced/curious users the following mechanisms will be in place:

From the top level version, it is highly desirable (I’d like to say mandatory?) that the top level version deterministically identify the precise version of the underlying components that will run on the micro:bit (in reality, this means the MicroPython version/build which should itself point to a DAL version and then an mbed one from there)

Not only could this enable direct viewing of dependent source (including the underlying C/C++), it could offer in some editors a list of known bugs in that version, and url links to the version that fixed it.

### Semantic versioning

The editor will use semantic versioning (http://semver.org/). In addition to breaking API changes, the following things will be considered ‘MAJOR’ changes
1) Addition of significant features if they interact with the existing deployed features
2) Things that would change screenshots of the editor that are published online or in books.

Additional buttons on a toolbar are fine, but removing or renaming existing buttons should be considered a breaking change.

Anything that could stop a script that previously worked from working must be considered a breaking change. In the case of MicroPython this means that things increasing memory consumption or reducing the flash available for a users’ script are likely breaking changes.

{<< what other things should constitute a breaking change, and should we allow certain kinds of breaking change inside a version of the editor? IE can we support more than one MicroPython version for a particular deployed version of the front-end?>>}}

It may be desirable to agree a high water mark in memory and growing beyond this is considered a breaking change. It would then be necessary to police memory growth but people do already do this I think. This would allow small increases in memory usage to be possible without a breaking change.

### URL versioning scheme

For each published major version, the deployed editor will live at

`python.microbit.org/v<major version>/editor.html`

Because the use of semantic versioning ensures that things will not break for the user when upgrading minor versions, there will not be fine-grained control over which minor version a user gets. 

For example visiting `python.microbit.org/v2/` will serve version `2.<latest minor>`

### Versions in URLs

When a script is published or shared, it must be published including the major version of the editor (and therefore the MicroPython stack) that it was created with so that anyone following the link will be taken back to the version the script was created with.

If a user visits python.microbit.org/latest/ and is working on the editor there, the URL published should still be versioned, such as python.microbit.org/v1/. 

See “workflows” for discussion of how the user will be notified about newer versions


### Versioning in hex files

When the user is provided a hex file, the full semantic editor version must also be embedded into the hex file at a known location so that when unpacking the hex, any version of the editor can offer to load the version that the script was created in.

The hex file must also contain some editor unique identity, so that any hex can be related to the appropriate editor, perhaps automatically (e.g. MP signature at known location).This could be part of the version number?

See “workflows” for discussion of how the user will be notified about the fact they are heading to an older version.

(This kind of thing can enable the ability to show a user the exact version of the source code that was used to generate their hex file, including MicroPython code)

## Release cadence

Because we must commit to maintaining and fixing versions that are deployed on python.microbit.org it is desirable to make a small number of major release. 

We propose an annual cadence for major releases, with an RC released early in the year so that a stable release can be made in July after the school year ends. This gives teachers time to become familiar with it before the school year start. The previous year’s version will remain available after this but will no longer be redirected to via python.microbit.org/latest or python.microbit.org/

For the first stable release (Ideally made in July 2017) there should be only a 6-month lifetime to allow a greater number of changes while the project is growing.

## Unstable Versions

There should be a mechanism to deploy versions of the editor that are not yet considered stable. These will not be widely exposed to the majority of visitors to the site, but will be published for enthusiasts, developers and other interested parties to help test the editor.

It should be very hard for a naive user to wind up using a beta by accident. (Think, about:config warning in Firefox, etc)

### Beta

There should, at times, be a beta branch that gives access to features not in the main deployed editor but that are likely to be in the next RC. 

We should find ways to display visually as well as with a dialogue, the status of beta. Crucially, the fact that users should expect a greater number of things that are broken

Links to beta versions for which semantically-versioned final releases, RC versions or newer betas exist should redirect automatically to newest of the possible options. The user should be told this has happened and have the option of going back (see workflows below)

As the beta is expected to be buggier than the RC or stable versions, we should warn teachers not to plan lessons around the beta versions unless absolutely necessary

### RC

Before a release is made, a RC branch should be used and deployed that allows users to see what the next version of the editor will contain. During the RC period, bugs will be fixed and the editor stabilised, but there should be no breaking changes (as dictated by a Semver process).

### Experimental Branches

Features in the these branches might go away, change, or break. We need to warn users very clearly and make sure teachers don’t base their lessons off things in these. 

We should find ways to display visually as well as with a dialogue, the status of beta. 

### Link sharing for unstable versions (beta, RC)

If a version is ‘unstable’ a user should not be able to share a link to that version without first confirming they understand the meaning of that. This could be done like the GitHub “delete repository” dialogue. If a user clicks ‘share’ in an unstable editor deployment their options should be

((Go to the stable editor and share from there))((Enter “temporary share” in the box below to create a link to the current beta))

### Link sharing for experimental versions

Users should not be able to create links directly that share to an experimental version, because those versions may go away (say, python.microbit.org/doomed_feature/1/ might only exist one week).

However, the publish feature for these branches should generate a URL that can be modified by an advanced user to link to an experimental version. This is a deliberate step to discourage use of the experimental editors for day-to-day work

### retiring feature branches

An unstable beta/RC branch, once retired, should redirect to the latest equivalent branch, or if it can be determined by the version of the branch, the stable version that this version became

Experimental branches can and will be destroyed with reckless abandon.

## Stable feature versions (’named versions’)

As well as versioned deployments we could also support named versions for providing special versions of the editor for specific events, features or configurations. Examples of this might be ‘blocks’, ‘tvseriesname’ or similar.

Not every build will be the same as every other, and it should be possible to turn on/off features without forking the codebase using a config file.

A named deployment could also enable pre-rolled, version specific frozen modules pre-imported. This would help for hardware specific or branded activities that require simple and fast engagement times.

### Storing the config for each deployment

The config for any deployment should be stored alongside that deployment so that it can be queried by other versions.

### Locations for named versions:

These versions will live at `python.microbit.org/<name>/v<version>`

The top level link at `<branchname>` will redirect to the latest version, and the `<version>` redirects will work exactly as in the spec above.

## Workflows for telling people about newer versions.

When a user arrives at any version of the editor, the editor will check for the existence of a version manifest. If found the editor can decide what information to present to the user.

If the editor is not the latest version AND the user has not already been redirected from a newer version (For example with ?redirect-from= maybe) then they will be prompted to move to the newest version. The text of the users’s script should be preserved as they user moves to the new version.
In arriving at the newer version, the user should be told that they have arrived from an older version, and a means by which they can return to the version that the originally come to (presumably the version that the script they were loading was created in, or at least last published from) in case things don’t work

 * Ideally, we should maintain a growing list of API breakages in newer versions of the editor as they happen so that we can scan code and warn users if it uses an API that has changed. 
 * In the case that there is a simulator and simulating the code on the new version determines errors, the user can be prompted more obviously than described above to update their code or go back
 
If the editor is not the latest version but the user *has* been redirected from an older version, two possible reasons for this are:

 * The user has dropped a hex file from an older version of the editor than they had loaded, and chosen to be redirected
 * The user has already moved versions once to a newer version, found fault with that and asked to come back

In these cases, it seems desirable not to prompt the user to move forward.

 {<<I’m up for discussing these workflows, I don’t really want dialogues in front of people, but I also don’t want to move versions under their feet. >>}}

## Versions manifest JSON

This specification relies on a version of the editor being able to know that it is no longer the ‘latest’ version and know the location of newer versions. This could be done by including a versions manifest that lives one level up from the editor.html. This manifest should contain:

 * The current stable version: `”stable” : “2.1”`
 * A list of all supported versions `”supported”: [ “1.3”, “2.1” ]`
 * A list of deprecated versions (not sure this is necessary?)
 
 {<< This seems very MVP, might be better to instead have every version listed and a status for each one? >>}
 
### Unstable versions
For any unstable branch of the editor, the version manifest will contain a full URL to a complete and stable version of the editor,

     …
    “stable”: “http://python.microbit.org/“,
     …
    
{<< Should I use JSON schema for this bit?>>}


