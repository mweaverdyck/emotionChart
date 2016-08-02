# Emotion Dynamics - Docs
## Contents
- [Issues](#issues)
- [Files](#files)
- [How to make changes](#how-to-make-changes)
  - [HTML Tips](#some-html-tips)
  - [Change instructions](#change-instructions)
  - [Change ID validation](#change-id-validation)
  - [Change other variables](#change-other-variables)
    - Variables in the `css` folder
      - [CSS Tips](#css-tips)
    - Variables in the `js` folder
- [How to get the data](#how-to-get-the-data)
- [How to read the data](#how-to-read-the-data)

## Issues
- Instructions have not been finished yet
- (Mobile compatibility?)

## Files


## How to make changes
###### Some HTML Tips
- `.html` files consists of a bunch of tags, one nested in another to form a tree-like structure (called the "DOM" tree).
- Each tag has an opening part (e.g. `<body>`, `<div>`, `<p>`) and a closing part (`</body>`, `</div>`, `</p>`).
- Classes are styles such as fonts, sizes and positions, and they are defined in `.css` files. They can be applied to tags like this: `<div class="some-class">...</div>`, or this: `<p class="one-class another-class">...</p>`
- Tags may also have other attributes, such as `id="xxx"` (a name to identify that tag in CSS/JavaScript), `align="center"`, etc.
- `<br/>` is a line break

#### Change instructions
Instructions at the beginning are in `index.html`. The first `div` inside `body` contains the three pages, whose `id`s are `page-1`, `page-2` and `page-3`. In each page `div`, there is another `div` containing the paragraphs (`<p>`s). You can simply change the instructions there, or add a new paragraph by adding `<p>Some new instructions here.</p>`.

Instructions at the end are in `experiment.html` -> `body` -> `div id="finish-page"`.

#### Change ID validation
Currently a "valid" ID is either anything 5 characters long, or "test". You can changes this in `instruction.js`, `function valid_id(uid)`. Just change this if condition to whatever you want. (Note: the `ID_LENGTH` variable is stored in `constants.js`.)

#### Change other variables
##### In folder `css`:

`chart.css` defines the styles, mostly positions and sizes, of the html elements in `experiment.html` (stuff below the comment "Experiment Pages") and `index.html` (stuff below the comment "Instruction Page").

###### CSS Tips
- A css item contains: a name + a `{` + a bunch of styles + a `}`
- The name could be either an html element _id_ or a _class name_. Those ids start with a `#`, and those class names start with a `.`
- For height/width/margin/padding/etc, there are several different sets of metrics:
  - `px`: pixels
  - `vh` or `vw`: means viewport height or viewport width. `1vh` means 1% of the viewport height. So this is proportional to the browser size (as oppose to `px`, which doesn't change according to browser size).
    - These are handy but might not be supported by some old browsers, therefore I also put a `px` value before using `vh` or `vw`, so that in case they are not recognized, it will fall back to the `px` value
  - percentage: means the percentage of its parent element. e.g. `<div id="parent">  <div id="child">stuff</div>  </div>` if parent width is 100px and child width is 50%, the child would be 50px wide.

##### In folder `js`:
- **`constants.js`** contains:
  - An array of all emotions (for each emotion, the first string is the chart title and the second is the subtitle).
  - A boolean `RANDOMIZE` (`true` or `false`)
  - An alert which shows up when people didn't click the 2nd month
  - Intensity (Y axis) ranges

###### Files below could be confusing
- `chart.js` contains all of the chart settings.
  - Note there are actually two charts one behind another. The chart on the back (`traceChartSettings`) shows the mouse trajectory and a grey band on the negative side of x axis, and the front chart has everything else.

- `get_missing_points.js` is just a function calculating positions of the absent points in the middle (e.g. when you click only on x=1, x=3 and x=5 it calculates the intersection points of your line and x=2, x=4)

- Other `hard-to-explain.js` which hopefully you don't need to change...

## How to get the data
- Log in to [Firebase](https://firebase.google.com/) with the lab gmail account, and click `Go to console` in the upper right corner.
- Select this project (`emotion dynamics`), then select `Database` on the left panel.
- You should be able to view the JSON data in the database. Export the json data (`Export JSON`).
- From this GitHub repo, get `parser.py` in `json-csv parser` folder.
- Put `parser.py` and the json data file in the same folder, and then run `parser.py` with the name of the data file as a command line parameter, like this:

  `python parser.py example_data.json`
- You should get the `.csv` files in the same folder

## How to read the data
Data is organized in this way:
- Data file
  - Subject 1
