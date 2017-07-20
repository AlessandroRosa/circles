var _glob_terminal_vars_catalogue = [];
var _glob_max_var_identifier_length = 12 ;

var _glob_terminal_vars_reserved_keywords = [];
    _glob_terminal_vars_reserved_keywords.push( "AS" );
    _glob_terminal_vars_reserved_keywords.push( "ALL" );
    _glob_terminal_vars_reserved_keywords.push( "COMPLEX" );
    _glob_terminal_vars_reserved_keywords.push( "DEST" );
    _glob_terminal_vars_reserved_keywords.push( "E" );
    _glob_terminal_vars_reserved_keywords.push( "FULL" );
    _glob_terminal_vars_reserved_keywords.push( "MATRIX" );
    _glob_terminal_vars_reserved_keywords.push( "MOBIUS" );
    _glob_terminal_vars_reserved_keywords.push( "PI" );
    _glob_terminal_vars_reserved_keywords.push( "VAR" );
    
    /* 1. type cast
       2. var class 
       3. obj constructor identifier
       4. strict requirement of constructor parameters (YES/NO)
       5. output member
       6. methods
       7. verbose definition
    */
var _glob_terminal_vars_type_map = [];
    _glob_terminal_vars_type_map.push( [ "COMPLEX", OBJ_USER_DEF_CLASS, "complex", NO, "formula()", "", "complex number" ] );
    _glob_terminal_vars_type_map.push( [ "MATRIX", OBJ_USER_DEF_CLASS, "complex_matrix", NO, "output()", "", "2x2 matrix" ] );
    _glob_terminal_vars_type_map.push( [ "MOBIUS", OBJ_USER_DEF_CLASS, "mobius_map", NO, "output()", "", "Mobius map" ] );
		_glob_terminal_vars_type_map.push( [ "POINT", OBJ_USER_DEF_CLASS, "point", NO, "output()", "properties,coords,draw,radius", "point" ] );
		_glob_terminal_vars_type_map.push( [ "LINE", OBJ_USER_DEF_CLASS, "line", NO, "output()", "properties,coords,draw", "line" ] );
		_glob_terminal_vars_type_map.push( [ "RECT", OBJ_USER_DEF_CLASS, "rect", NO, "output()", "properties,coords,draw,fill", "rect" ] );

var _glob_terminal_vars_formulas_arithmetic_operators = [ "+", "-", "*", "/" ];
var _glob_terminal_vars_formulas_parentheses = [ "(", ")", "[", "]", "{", "}" ];
var _glob_terminal_vars_formulas_fns = [];
    _glob_terminal_vars_formulas_fns.push( "log" );
    _glob_terminal_vars_formulas_fns.push( "sin" );
    _glob_terminal_vars_formulas_fns.push( "cos" );
    _glob_terminal_vars_formulas_fns.push( "tan" );
    _glob_terminal_vars_formulas_fns.push( "cotan" );
    _glob_terminal_vars_formulas_fns.push( "sec" );
    _glob_terminal_vars_formulas_fns.push( "cosec" );
    _glob_terminal_vars_formulas_fns.push( "acos" );
    _glob_terminal_vars_formulas_fns.push( "asin" );
    _glob_terminal_vars_formulas_fns.push( "atan" );
    _glob_terminal_vars_formulas_fns.push( "acotan" );