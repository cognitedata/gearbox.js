SVG-viewer
==========================
## Description
SVG-viewer is a component which visualise `.svg`-documents in a user interactive way.

SVG-viewer provides the following functionality:
- Display documents with zoom and panning functionality for both desktop and mobile
- Highlight equipment and provide callbacks for further interaction
- Locate and zoom onto equipment in the document
- Search by equipment with locating and zooming results

## File format

In order to grasp the full functionality of the viewer `.svg`-document should be structured in the special way. Equipment should be grouped under `g` element. Each such a group should contain `metadata` element with valuable and searchable infromation (i.e. equipment id, name, etc).

## Issues

Questions, feature requests or bugs should be followed by a GitHub issue and assigned to @valerii-cognite
