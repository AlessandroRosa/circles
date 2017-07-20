var _glob_method = METHOD_NONE ;
var _glob_last_method = METHOD_NONE ;

var _glob_items_to_init = NO ;
var _glob_init_mask = INIT_FROM_DISKS | INIT_PAIRED_ITEMS ;
var _glob_probabilityRNDrecalcAUTOMATICflag = YES ;
var _glob_probabilityRNGmethod = RNG_BUILT_IN ;
var _glob_probability_showcase_array = null ;
var _glob_gens_set_rowcount = 0 ;
var _glob_gens_set_to_init = NO ;
var _glob_gens_set_report = "" ;

var _glob_items_anti_homography_mask_map = [] ;

var _glob_repetendsAPPLY = DISABLED ;
var _glob_items_switch = ITEMS_SWITCH_SEEDS | ITEM_BYVAL ;
var _glob_process = PROCESS_BREADTHFIRST ;
var _glob_fixedpt_io = FIXEDPOINTS_IO_INPUT ;
var _glob_rnd_warmup = DEFAULT_RND_WARMUP ;
var _glob_rnd_reps_threshold = DEFAULT_RND_REPS_THRESHOLD ;
var _glob_rnd_reps_depth = DEFAULT_RND_REPS_DEPTH ;

var _glob_submethod_desc = "" ;
var _glob_construction_mode = CONSTRUCTION_TILING ;

var _glob_disk_sel_index = UNDET, _glob_disk_sel_index = UNDET, _glob_disk_sel_locked = NO ;

var _glob_pairingCIRCLESmapINDEX = UNDET ;
var _glob_pairingCIRCLESparamA = new complex();
var _glob_pairingCIRCLESparamB = new complex();
var _glob_pairingCIRCLESparamC = new complex();
var _glob_pairingCIRCLESparamD = new complex();

_glob_presets['genssets'] = [];
_glob_presets['rnd'] = [];

_glob_presets['genssets'].push( [ "Seeds + Commutators", "a", "A", "b", "B", "abAB", "ABab" ] );
_glob_presets['rnd'].push( [ "Seeds + Commutators", 0.235, 0.235, 0.235, 0.235, 0.03, 0.03 ] );