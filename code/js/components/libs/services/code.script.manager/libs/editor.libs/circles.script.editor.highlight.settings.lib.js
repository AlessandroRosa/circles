/* possibly collisions between reg expressions (such as for special syntax ones) could
   be avoided by proper sequence in the array so that thet are evaluated first
*/

_glob_script_editor_highlights = [ 
		[ "bracket", /\[|\]|\(|\)|\{|\}/ ],
    [ "special_syntax", /\(([\_\s\w\,]+)\)\s?\=\s?\(([\d\w\s\.\,]+)\)/ ], // => (a,b,c,d)=(1,2,3,4)
    [ "special_syntax", /\(([\s\_A-Za-z0-9\<|\>|\>=|\<=]{1,})\)/ ], // => (a < b <= c ... >= m <= ... > z ...)
    [ "special_syntax", /(\w*)\[([\d\.\,\-]*)\]/ ],
    [ "number", /\d+\.?\d*[e|E]\d+/ ], // scientific notation
		[ "number", /\d*\.?\d+/ ],
	  [ "variable", /\_*[a-zA-Z][a-zA-Z0-9]*/ ]
	] ;
  
_glob_script_editor_reserved_javascript = [ "abstract", "arguments", "boolean", "break", "byte",
		"case", "catch", "char", "class", "const",
		"continue", "debugger", "default", "delete", "do",
		"double", "else", "enum", "eval", "export",
		"extends", "false", "final", "finally", "float",
		"for", "function", "goto", "if", "implements",
		"import", "in", "instanceof", "int", "interface",
		"let", "long", "native", "new", "null",
		"package", "private", "protected", "public", "return",
		"short", "static", "super", "switch", "synchronized",
		"this", "throw", "throws", "transient", "true",
		"try", "typeof", "var", "void", "volatile", "while", "with", "yield"
  ] ;

_glob_script_editor_circles_objs_marker = [ "@gens", "@item", "@mobius", "@matrix", "@seeds", "@3dpoint" ] ;

_glob_script_editor_reserved_circles = [ "canvas", "circle", "complex",
		"complex_matrix", "farey", "fraction", "item_obj",
    "line", "mobius_map",
    "p_adic", "point", "point_3d", "polygon", "probability",
    "rect", "screen_mapper",
		"write", "error", "warning" ] ;
    
_glob_script_editor_builtin_data_types = [
[ "canvas", "" ], [ "circle", "" ], [ "complex", "" ], [ "complex_matrix", "@matrix" ],
[ "farey", "" ], [ "fraction", "" ], [ "item_obj", "@item" ], [ "line", "" ], [ "mobius_map", "@mobius" ],
[ "p_adic", "" ], [ "point", "" ], [ "point_3d", "@3dpoint" ], [ "polygon", "" ], [ "probability", "" ],
[ "rect", "" ], [ "screen_mapper", "@mapper" ]
] ;