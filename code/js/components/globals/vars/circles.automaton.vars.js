var _glob_using_automaton = NO ;

var _glob_automatons_src_words_array = [] ;
		_glob_automatons_src_words_array[ "2 gens punctured torus" ] = [ "a", "b", "A", "B" ] ;
		_glob_automatons_src_words_array[ "2-order commutator" ] = [ "a", "b", "A", "B" ] ;

var _glob_preset_automatons_array = [] ;
_glob_preset_automatons_array[ "2 gens punctured torus" ] = [] ;
_glob_preset_automatons_array[ "2-order commutator" ] = [] ;
		
_glob_preset_automatons_array[ "2 gens punctured torus" ][ "e" ] = [ "a", "b", "A", "B" ] ;
_glob_preset_automatons_array[ "2 gens punctured torus" ][ "a" ] = [ "a", "b", "e", "B" ] ;
_glob_preset_automatons_array[ "2 gens punctured torus" ][ "b" ] = [ "a", "b", "A", "e" ] ;
_glob_preset_automatons_array[ "2 gens punctured torus" ][ "A" ] = [ "e", "b", "A", "B" ] ;
_glob_preset_automatons_array[ "2 gens punctured torus" ][ "B" ] = [ "a", "e", "A", "B" ] ;
		
_glob_preset_automatons_array[ "2-order commutator" ][ "e" ] = [ "a", "b", "A", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "a" ] = [ "a", "ab", "e", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "b" ] = [ "ba", "b", "bA", "e" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "A" ] = [ "e", "b", "A", "AB" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "B" ] = [ "Ba", "e", "BA", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "ab" ] = [ "ba", "b", "abA", "e" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "AB" ] = [ "ABa", "e", "BA", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "ba" ] = [ "a", "ab", "e", "baB" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "bA" ] = [ "e", "b", "A", "baB" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "Ba" ] = [ "a", "Bab", "e", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "BA" ] = [ "e", "BAb", "A", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "abA" ] = [ "e", "b", "A", "abAB" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "ABa" ] = [ "a", "ABab", "e", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "baB" ] = [ "Ba", "e", "e", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "bAB" ] = [ "e", "e", "BA", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "Bab" ] = [ "ba", "b", "e", "e" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "BAb" ] = [ "e", "b", "bA", "e" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "abAB" ] = [ "e", "e", "BA", "B" ] ;
_glob_preset_automatons_array[ "2-order commutator" ][ "ABab" ] = [ "ba", "b", "e", "e" ] ;