/**
* responsiveModules(em)
* - pass in our current em value in px if we have it
* - grabs our trigger points from our module
* - we loop through these and use only the ones below our current size
* - these are then added to the module parent element
* - the CSS uses the attribute selector to assign styles rather than media queries
**/

(function(window, document){
    var fireEvent = false, elementID = 'content', moduleClassName = 'mod', measurement = 'em',

    responsiveModules = function() {
        var emInPX              = document.getElementById('size-test').offsetWidth,
            content             = document.getElementById(elementID),
            clone               = content.cloneNode(true),
            mod                 = getResponsiveModules(content.getElementsByClassName(moduleClassName)),
            mod_clone           = clone.getElementsByClassName(moduleClassName),
            mod_total           = mod.length, pxWidth = false, i = 0,
            triggerAttribute    = false, triggerList = false, emMeasurement = false;

        if (mod.length>0) {
            for (i; i<mod_total; i++) {
                pxWidth         = mod[i].offsetWidth;
                emMeasurement   = pxWidth/emInPX;
                triggerList     = buildTriggerList(mod[i], emMeasurement);

                triggerAttribute = (Array.isArray(triggerList) ? triggerList.join(' ') : false);
                if (triggerList) {
                    mod_clone[i].parentNode.setAttribute('data-width', triggerAttribute);
                }
            }
            content.parentNode.replaceChild(clone,content);
        }
    },

    buildTriggerList = function(element, emMeasurement) {
        if (element.getAttribute('data-triggers') === undefined) { return false; }
        var triggerList     = [],
            triggerPoints   = element.getAttribute('data-triggers').split(',').sort(),
            totalTriggers   = triggerPoints.length,
            hasRange        = false,
            range           = false,
            i               = 0;

        for(i=0; i<totalTriggers; i++) {
            if (triggerPoints[i].indexOf('-') > 0) {
                range = triggerPoints[i].split('-');
                hasRange = createRange(emMeasurement,range[0],range[1]);
                if (hasRange) {
                    triggerList.push(hasRange);
                }
            } else {
                if (emMeasurement > triggerPoints[i]) {
                    triggerList.push(wrapFormat(triggerPoints[i]));
                } else {
                    resetParentWidth(element);
                }
            }
        }

        if (triggerList.length > 0) {
            return triggerList;
        }
    },

    getResponsiveModules = function(nodes) {
        var i=0, totalNodes = nodes.length, collection = [];

        if (!nodes) { return; }

        for (i;i < totalNodes; i++) {
            if (nodes[i].hasAttribute('data-triggers')) {
                collection.push(nodes[i]);
            }
        }
        return collection;
    },

    createRange = function(emMeasurement, opt1, opt2) {
        if (emMeasurement > opt1 && emMeasurement < opt2) {
            return opt1 +'-'+ wrapFormat(opt2);
        } else {
            return false;
        }
    },

    resetParentWidth = function(element) {
        element.parentNode.removeAttribute('data-width');
    },

    setTimeoutObj = function(o, t, f, a) {
        return setTimeout(function () {
            f.apply(o, a);
        }, t);
    },

    wrapFormat = function(value) {
        return value+measurement;
    },

    runOnResize = function() {
        if (fireEvent !== false) {
            clearTimeout(fireEvent);
        }
        fireEvent = setTimeoutObj(false, 50, responsiveModules, []);
    };

    // onLoad
    window.addEventListener ? window.addEventListener("load",responsiveModules,false) : window.attachEvent && window.attachEvent("onload",responsiveModules);

    // onResize
    window.addEventListener ? window.addEventListener("resize",runOnResize,false) : window.attachEvent && window.attachEvent("onresize",runOnResize);

    // triger on orientation change as well as resize...
    window.addEventListener ? window.addEventListener("orientationchange",runOnResize,false) : window.attachEvent && window.attachEvent("onorientationchange",runOnResize);

})(window, document);