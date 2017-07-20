// sub-entries in the main array are evaluated according to the same order as they
// have been declared here

/////////////////
// the following arrays include settings to pre-process code before being compiled

_glob_circles_js_translation.push( [ 'data.type.markers', 
		[ "@alphabet", "_glob_alphabet" ],
		[ "@gens", "_glob_gens_array" ],
		[ "@item", "item_obj" ], [ "@mapper", "screen_mapper" ], [ "@matrix", "complex_matrix" ], [ "@mobius", "mobius_map" ],
    [ "@3dpoint", "point_3d" ],
		[ "@seeds", "_glob_seeds_array" ]
	] ) ;

_glob_circles_js_translation.push( [ 'internal_methods', 
		[ "_glob_seeds_array.add", "_glob_seeds_array.push" ],
		[ "_glob_gens_array.add", "_glob_gens_array.push" ]
	] ) ;