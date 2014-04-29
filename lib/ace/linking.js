/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

// var RangeList = require("./range_list").RangeList;
// var Range = require("./range").Range;
// var Selection = require("./selection").Selection;
var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var onMouseDown = require("./mouse/linking_handler").onMouseDown;
var onMouseMove = require("./mouse/linking_handler").onMouseMove;
var event = require("./lib/event");
var lang = require("./lib/lang");

// Todo: session.find or editor.findVolatile that returns range
var Search = require("./search").Search;
var search = new Search();

// extend EditSession
var EditSession = require("./edit_session").EditSession;
(function() {
    // this.getSelectionMarkers = function() {
    //     return this.$selectionMarkers;
    // };
}).call(EditSession.prototype);

// extend Editor
var Editor = require("./editor").Editor;
(function() {

    this.$onLink = function(e) {
        /*%*/ console.log("onLink!"); /*%*/
    };

}).call(Editor.prototype);

// patch
// adds linking support to a session
// exports.onSessionChange = function(e) {
//     var session = e.session;
//     if (!session.linking) {
//         session.linking = new Linking();
//     }

//     var oldSession = e.oldSession;
//     if (oldSession) {
//         oldSession.linking.removeEventListener("link", this.$onLink);
//     }

//     session.linking.on("link", this.$onLink);
// };

// Linking(editor)
// adds linking support to the editor
// (note: should be called only once for each editor instance)
function Linking(editor) {
    /*%*/ console.log("Linking!"); /*%*/
    // if (editor.$linkingOnSessionChange)
    //     return;
    // editor.$linkingOnSessionChange = exports.onSessionChange.bind(editor);

    // editor.$linkingOnSessionChange(editor);
    // editor.on("changeSession", editor.$linkingOnSessionChange);

    editor.on("mousedown", onMouseDown);
    editor.on("mousemove", onMouseMove);
    // editor.commands.addCommands(commands.defaultCommands);

    addAltCursorListeners(editor);
}

function addAltCursorListeners(editor){
    var el = editor.textInput.getElement();
    var altCursor = false;
    event.addListener(el, "mousemove", function(e) {
        /*%*/ console.log("addListener(el!"); /*%*/
        if (e.keyCode == 18 && !(e.ctrlKey || e.shiftKey || e.metaKey)) {
            if (!altCursor) {
                editor.renderer.setMouseCursor("crosshair");
                altCursor = true;
            }
        } else if (altCursor) {
            reset();
        }
    });

    event.addListener(el, "keyup", reset);
    event.addListener(el, "blur", reset);
    function reset(e) {
        if (altCursor) {
            editor.renderer.setMouseCursor("");
            altCursor = false;
            // TODO disable menu poping up
            // e && e.preventDefault()
        }
    }
}

(function() {
    oop.implement(this, EventEmitter);
}).call(Linking.prototype);

exports.Linking = Linking;


require("./config").defineOptions(Editor.prototype, "editor", {
    enableLinking: {
        set: function(val) {
            Linking(this);
            if (val) {
                this.on("changeSession", this.$linkingOnSessionChange);
                this.on("mousedown", onMouseDown);
                this.on("mousemove", onMouseMove);
            } else {
                this.off("changeSession", this.$linkingOnSessionChange);
                this.off("mousedown", onMouseDown);
                this.off("mousemove", onMouseMove);
            }
        },
        value: true
    }
})



});
