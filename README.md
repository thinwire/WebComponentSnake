# Web Component Snake

## Introduction

This is a personal project that I've used for teaching myself how to build, access and interconnect Web Components using the Polymer framework.
This project just happens to be a snake game, since it's a problem of a very limited scope, and thus easy for me to get my head around. On the other hand, it provides good opportunities for studying web components, in that each part of the problem is cleanly separable and communication between parts can be externalized.

For you, as an anonymous end user, this can serve as an example of how to create a web component and/or how to set up a game loop in HTML5.

## Requirements

This game has been tested to work on Chrome 46 and Firefox 41. Your mileage may vary.
Compilation uses GNU Make and the [TypeScript](http://www.typescriptlang.org/) compiler installed along the PATH.

## Screenshot

![screenshot](screenshot.jpg "Snake Game in Action")

## Try it

Play the compiled game [here](http://uncoolbens.org/snake2/)

## Limitations

- Apples can appear inside the snake body. This is a feature, not a bug. In order to keep the code clean, I decided to leave out the swath of logic required to decide upon a free slot for the apple in constant time.
- Keypresses are handled on a last-come, first-serve basis, instead of being buffered. This means that turning tight corners can become tricky. This should be fixed for the next version.
- The page needs to be reloaded to restart the game.

## Acknowledgements 

The favicon I'm using is from [IconArchive](http://www.iconarchive.com/show/animal-icons-by-martin-berube/snake-icon.html) - it is licensed as freeware.
The WebFont is from Google's Web Fonts repository. It's called [Play](https://www.google.com/fonts/specimen/Play) and is licensed under the SIL Open Font License.

