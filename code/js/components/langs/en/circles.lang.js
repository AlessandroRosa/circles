var LANG_MSG_00 = "opening a pop-up to display help text in html version" ;

var _ERR_00_00 = "Unknown error" ;
var _ERR_00_01 = "Operation perfomed with success" ;
var _ERR_00_02 = "Group consistence failed:\n " + _ERR_33_01 ;
var _ERR_00_03 = "Run-time error.\nPlease, reload this page." ;
var _ERR_00_04 = "Can't display symbols : " + _ERR_33_01 ;
var _ERR_00_05 = "Color coordinates do not match the required standard values" ;
var _ERR_00_06 = "Can't perform SHIFTING.\n\nSelection is empty" ;
var _ERR_00_07 = "Can't perform ROTATION.\n\nThe input shifting values are both zero" ;
var _ERR_00_08 = "Can't perform ROTATION. No elements selected" ;
var _ERR_00_09 = "Can't perform ROTATION.\n\nThe angle value is zero" ;
var _ERR_00_10 = "Can't perform this operation: " + _ERR_33_01 ;
var _ERR_16_00 = "Can't view isometric circles: " + _ERR_33_03 ;
var _ERR_17_00 = "Database is corrupted: symbol and its inverse are the same.\n\nSet correct symbols or click the 'Suggest' button" ;
var _ERR_17_01 = "Database is corrupted: symbol and its inverse are the same.\n\nReload this page" ;
var _ERR_19_01 = "Can't display isometric circles: the input symbol is not of alphabetic kind" ;
var _ERR_19_02 = "Can't display isometric circles: " + _ERR_33_03 ;
var _ERR_24_01 = "Can't draw anything.\nChoose a method first" ;
var _ERR_24_02 = "Can't perform operation: method is unknown.\nPlease, choose a method" ;
var _ERR_24_03 = "Can't init items: method is unknown\nPlease, choose a method" ;
var _ERR_24_04 = "Can't fill items: method is unknown.\nPlease, choose a method" ;
var _ERR_26_00 = "Archival error: index failure" ;
var _ERR_26_01 = "Archival error: no seed found" ;
var _ERR_33_01 = "The seeds list is empty" ;
var _ERR_33_02 = "The gens list is empty" ;
var _ERR_33_03 = "The input symbol is empty" ;
var _ERR_33_04 = "The dictionary is empty" ;
var _ERR_33_05 = "This service is not available for the chosen method" ;
var _ERR_33_06 = "The number of items for the candidate group must be even" ;

var CIRCLES_WARNING_LABEL_02 = "Shortcuts don't work when process is running" ;
var CIRCLES_WARNING_LABEL_03 = "This action has been disabled while the process is running" ;

var TERMINAL_LABEL_01 = "Batch script detected: type 'code' for changes to take effect" ;

var _QUESTION_01 = "Confirm to apply all settings ?" ;
var _QUESTION_02 = "Confirm to reset all settings ?" ;
var _QUESTION_03 = "Confirm to shift symbols ?" ;
var _QUESTION_04 = "Confirm deselection ?" ;
var _QUESTION_05 = "Confirm to remove all circles? " ;
var _QUESTION_06 = "Confirm to remove the selected circle ?" ;
var _QUESTION_07 = "Some data have changed, but not saved yet.\nIf you proceed, you'll lose your changes.\n\nContinue anyway ?" ;
var _QUESTION_08_01 = "Confirm to add the new circle ?" ;
var _QUESTION_08_02 = "Confirm to apply new coordinates to the selected circle ?" ;
var _QUESTION_08_03 = "Confirm to add this new Mobius map ?" ;
var _QUESTION_09 = "Confirm to swap symbols for selected entries ?" ;
var _QUESTION_10_01 = "Confirm to remove symbols association\nfrom the selected element ?" ;
var _QUESTION_10_02 = "Confirm to remove symbols association\nfrom the selected elements ?" ;
var _QUESTION_10_03 = "Confirm to remove all symbols ?" ;
var _QUESTION_11_01 = "Confirm to flush the whole palette away ?" ;
var _QUESTION_11_02 = "Confirm to remove this color from the palette ?" ;
var _QUESTION_11_03 = "Confirm to add this color to the palette ?" ;
var _QUESTION_11_04 = "Confirm to change this color ?" ;
var _QUESTION_17_01 = "Confirm to add the new line ?" ;
var _QUESTION_17_02 = "Confirm to apply the new coordinates to the selected line ?" ;
var _QUESTION_18_01 = "Confirm to shift the selected seed? " ;
var _QUESTION_18_02 = "Confirm to shift the selected seeds ?" ;
var _QUESTION_18_03 = "Confirm the rotation of the selected seed? " ;
var _QUESTION_18_04 = "Confirm the rotation of the selected seeds ?" ;
var _QUESTION_18_05 = "Confirm to copy all seeds into the storage space ?" ;
var _QUESTION_18_06 = "Confirm to copy all gens into the storage space ?" ;
var _QUESTION_19 = "Confirm to set the following params to this map ?" ;
var _QUESTION_20_03 = "Confirm to compute circles from all Mobius map params ?" ;
var _QUESTION_24 = "Confirm to apply symbols to all entries automatically ?" ;
var _QUESTION_25 = "Confirm to zoom into the selected circle ?" ;
var _QUESTION_26_01 = "Mobius map params will be reset, according to both method and circles coordinates.\n\nContinue ?" ;
var _QUESTION_27 = "Confirm to set up a new circles config ?\n\n(All settings will be lost)" ;
var _QUESTION_28 = "Action on Mobius map params\n<b>Init</b>: params are set up according to screen circles" ;
var _QUESTION_29 = "Confirm to remove the color?\n\n(Note: if the 'fill color' flag is set, then the current palette applies.)" ;

var _CAPTION_BTN_01 = "Left" ;
var _CAPTION_BTN_02 = "Right" ;
var _CAPTION_BTN_03 = "Up" ;
var _CAPTION_BTN_04 = "Down" ;
var _CAPTION_BTN_05 = "Center" ;
var _CAPTION_BTN_06 = "Reload" ;
var _CAPTION_BTN_07 = "Close" ;

var _CANVAS_CLEANVIEW_BTN_LABEL = "Clean View" ;
var _CANVAS_LANG_LABEL = "Language" ;

function CIRCLES_LABEL_01_FN( _symbol ) { return "Can't resolve the isometric circles match:\nthe element with inverse symbol ('"+_symbol+"') has not been registered yet" ; } 