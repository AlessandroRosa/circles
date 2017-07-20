var _glob_punctuation = [ ",", ":", ";", ".", "!", "?", "-", "^", "\\" ] ;
var _glob_illegal_symbols = [ "#", "\"", "$", "§", "°", "£" ]
var _glob_original_dict = [] ;
var _glob_dict_processor = null ;

var _glob_dict_check = YES ;
var _glob_dict_create = YES ;
var _glob_dict_entries_per_page = 1000 ;
var _glob_dict_selected_page = 0 ;

/* this is an associative array
   fields:
   'use_reduced_words' >> yes / no
   'compute_inv_symbol' >> yes / no
*/
var _dictionary_init_settings_array = [];
    _dictionary_init_settings_array['use_reduced_words'] = NO ;
    _dictionary_init_settings_array['allow_repetition'] = NO ;
    _dictionary_init_settings_array['compute_inv_symbol'] = NO ;
    _dictionary_init_settings_array['longest_words_only'] = NO ;
    _dictionary_init_settings_array['crash_words_packed'] = "" ;