var CRLF_WIN = "\r\n", CRLF_NO_WIN = "\n" ;
var UNDET = -1, UNFOUND = -1, UNDEF = "undefined" ;
var ENABLED = 1, SHOW = 1, OPEN = 1, YES = 1, ON = 1 ;
var DISABLED = 0, HIDE = 0, CLOSE = 0, NO = 0, NULL = 0, OFF = 0 ;
var STOP = 0, GO = 1, IF_ANY = 2, IF_NOT_EXISTING = 3, PENDING = 4, SKIP = 5 ;
var SUSPENDED = 6, EXISTS = 7, NOT_EXISTS = 8, CHECK = 9, PASSED = 10, FAILED = 11 ;
var ALL_PLANES = -1, NO_PLANE = 0, Z_PLANE = 1, W_PLANE = 2, BIP_BOX = 3, D_LOCUS = 4, CUSTOM_PLANE = 5 ;
var EXPORT_NONE = 0, EXPORT_SVG = 1, EXPORT_PS = 2, EXPORT_EPS = 3, EXPORT_PDF = 4, EXPORT_LATEX = 5, EXPORT_PNG = 6 ;
var RET_OK = 1, RET_ERROR = 0, RET_IRRELEVANT = -1, RET_WARNING = -2, RET_CRITICAL = -3, RET_UNAUTHORIZED = -4 ;
var COLOR_RGB_INT = 1, COLOR_RGB_HEX = 2, COLOR_TAG = 3 ;
var CAPS_LETTER = 0, SMALL_LETTER = 1 ;

var CIRCLES_TWO_PI = 2.0 * Math.PI ;
var CIRCLES_MAX_COORD = Math.pow( 2, 16 ) ;

var DIMS_NONE = 0, DIMS_1D = 1, DIMS_2D = 2, DIMS_3D = 3 ;

var Z_PLANE_LAYERS_PILE_ID = "ZPLANElayers_pile" ;
var W_PLANE_LAYERS_PILE_ID = "WPLANElayers_pile" ;

var CONSTRUCTION_NONE = 0, CONSTRUCTION_TILING = 1, CONSTRUCTION_LIMITSET = 2 ;
var ZPLANE_CANVAS_NULL_MODE = 0, ZPLANE_CANVAS_CIRCLESDRAW_MODE = 1 ;
var CANVAS_COORDS_AXES_MODE = 1, CANVAS_COORDS_GRID_MODE = 2 ;
var CANVAS_CARTESIAN_MAP = 1, CANVAS_SCREEN_MAP = 2 ;

var CIRCLES_MISSING_SEEDS = -1, CIRCLES_MISSING_INPUT = -2, CIRCLES_MISSING_ALPHABET = -3, CIRCLES_INVALID_ITEMS_CONTAINER = -4 ;

var CONFIG_STD = 0, CONFIG_BIPBOX = 1 ;
var CALLER_TYPE_NONE = 0, CALLER_TYPE_CMD = 1, CALLER_TYPE_CANVAS = 2 ;

// these vars will be init later
var COLOR_STD = "" ;
var COLOR_DISABLED = "" ;
var COLOR_ERROR = "" ;
var COLOR_INFO = "" ;
var COLOR_SUCCESS = "" ;
var COLOR_WARNING = "" ;

var DICTIONARY_ERR_EMPTY_INPUT = -3 ;
var DICTIONARY_ERR_INCOHERENT_INPUT = -2 ;
var DICTIONARY_ERR_MISSING_INPUT = -1 ;

var DISPATCH_STANDARD = 0 ;
var DISPATCH_SUCCESS = 1 ;
var DISPATCH_YESNO = 2 ;
var DISPATCH_YESNOCANCEL = 4 ;
var DISPATCH_OKCANCEL = 8 ;
var DISPATCH_WARNING = 16 ;
var DISPATCH_QUESTION = 32 ;
var DISPATCH_CRITICAL = 64 ;
var DISPATCH_NOBUTTON = 128 ;
var DISPATCH_ONCLOSE = 256 ;
var DISPATCH_NOICON = 512 ;
var DISPATCH_NOCAPTION = 1024 ;
var DISPATCH_INFO = 2048 ;
var DISPATCH_HELP = 4096 ;
var DISPATCH_ERROR = 8192 ;
var DISPATCH_HALT = 16384 ;

var DISPATCH_TEXTCOLOR_TYPE = 32768 ;
var DISPATCH_MULTICOLOR = 65536 ;

var DISPATCH_OK = 1 ;
var DISPATCH_CANCEL = 2 ;
var DISPATCH_YES = 3 ;
var DISPATCH_NO = 4 ;

var DRAWENTITY_NONE = "" ;
var DRAWENTITY_ISOMETRIC_CIRCLE = 1 ;
var DRAWENTITY_INVERSION_CIRCLE = 2 ;
var DRAWENTITY_PIXEL = 3 ;
var DRAWENTITY_POINT = 4 ;
var DRAWENTITY_POLYLINE = 5 ;

var DRAWENTITY_NONE_CMD = "" ;
var DRAWENTITY_INVERSION_CIRCLE_CMD = "inversion" ;
var DRAWENTITY_ISOMETRIC_CIRCLE_CMD = "isometric" ;
var DRAWENTITY_PIXEL_CMD = "pixel" ;
var DRAWENTITY_POLYLINE_CMD = "polyline" ;
var DRAWENTITY_POINT_CMD = "point" ;

var DRAWENTITY_NONE_DEF = "" ;
var DRAWENTITY_INVERSION_CIRCLE_DEF = "inversion circle" ;
var DRAWENTITY_ISOMETRIC_CIRCLE_DEF = "isometric circle" ;
var DRAWENTITY_PIXEL_DEF = "pixel" ;
var DRAWENTITY_POLYLINE_DEF = "polyline" ;
var DRAWENTITY_POINT_DEF = "point" ;

var FIGURE_CLASS_NONE = 0, FIGURE_CLASS_CIRCLE = 1, FIGURE_CLASS_LINE = 2 ;
var FIGURE_CLASS_POINT = 3, FIGURE_CLASS_RECT = 4, FIGURE_CLASS_POLYGON = 5 ;

var FIXEDPOINT_NONE = 0, FIXEDPOINT_SINK = 1 ;
var FIXEDPOINT_SOURCE = 2, FIXEDPOINT_NEUTRAL = 3, FIXEDPOINT_USERDEFINED = 4 ;

var FN_DEF_NONE = 0, FN_DEF_MOBIUS = 1, FN_DEF_FORMULA = 2 ;

var FIND_LAYER_BY_ROLE_INDEX = 1, FIND_LAYER_BY_ROLE_DEF = 2, FIND_LAYER_BY_ROLE_CANVAS_ID = 3 ;

var FIXEDPOINTS_IO_NONE = 0 ;
var FIXEDPOINTS_IO_INPUT = 2 ;

var GROUP_TEST_ERR_UNDET = 0 ;
var GROUP_TEST_ERR_OK = 1 ;
var GROUP_TEST_ERR_EMPTY_GROUP = -1 ;
var GROUP_TEST_ERR_UNPAIRED_GROUP_ITEMS = -2 ;
var GROUP_TEST_ERR_MISSING_INVERSE_ITEM = -3 ;
var GROUP_TEST_ERR_INCONSISTENT_ITEM_OBJ = -4 ;
var GROUP_TEST_ERR_MISSING_ITEM_SYMBOL = -5 ;
var GROUP_TEST_ERR_INCONSISTENT_ITEM_MEMBERS = -6 ;
var GROUP_TEST_ERR_UNMATCHING_ITEM_SYMBOL = -7 ;
var GROUP_TEST_ERR_MISSING_INPUT_CONTAINER = -8 ;

var INIT_NONE = 0, INIT_LOCK = 1, INIT_AUTO_RECOGNITION = 2, INIT_FROM_DISKS = 4, INIT_FROM_MAPS = 8 ;
var INIT_SINGLE_ITEMS = 16, INIT_PAIRED_ITEMS = 32, INIT_CALC_CIRCLES = 64, INIT_SYMBOLS = 128 ;
var INIT_ALL = 0xFF - INIT_LOCK - INIT_AUTO_RECOGNITION ;

var INTERFACE_NONE = -1 ;
var INTERFACE_DEFAULT = 0 ;
var INTERFACE_EXTEND_NONE = 0 ;
var INTERFACE_EXTEND_ZPLANE = 1 ;
var INTERFACE_EXTEND_WPLANE = 2 ;
var INTERFACE_INPUT_NONE = 0 ;
var INTERFACE_INPUT_WIDTH = 1 ;
var INTERFACE_INPUT_HEIGHT = 2 ;
var INTERFACE_FORCE_NONE = 0 ;
var INTERFACE_FORCE_SHOW = 1 ;
var INTERFACE_FORCE_HIDE = 2 ;

var ITEM_SWITCH_TO_NONE = 0 ;
var ITEMS_SWITCH_SEEDS = 1 ;
var ITEMS_SWITCH_GENS = 2 ;
var ITEM_BYREF = 4 ;
var ITEM_BYVAL = 8 ;

var ITEM_ERR_UNDET = -1 ;
var ITEM_ERR_NONE = 0 ;
var ITEM_ERR_CIRCLE = 1 ;
var ITEM_ERR_MOBIUS = 2 ;
var ITEM_ERR_INCONSISTENT = 3 ;

var LOG_NONE = 0, LOG_SUCCESS = 1, LOG_ERROR = 2, LOG_WARNING = 3 ;

var METHOD_NONE = 0, METHOD_INVERSION = 1, METHOD_ALGEBRAIC = 2 ;

var METHOD_NONE_DEF = "None" ;
var METHOD_INVERSION_DEF = "Inversion" ;
var METHOD_ALGEBRAIC_DEF = "Algebraic" ;

var METHOD_NONE_CMD_DEF = "none" ;
var METHOD_INVERSION_CMD_DEF = "inversion" ;
var METHOD_ALGEBRAIC_CMD_DEF = "algebraic" ;

var MOUSE_NO_PROC_ID = 0 ;
var MOUSE_DRAGDISKS_PROC_ID = 1 ;
var MOUSE_ZOOM_PROC_ID = 2 ;
var MOUSE_TANGENTCIRCLE_PROC_ID = 3 ;
var MOUSE_WORDORBIT_PROC_ID = 4 ;
var MOUSE_SELECTDISKS_PROC_ID = 5 ;
var MOUSE_DRAWDISKS_PROC_ID = 6 ;
var MOUSE_PICK_POINTS_PROC_ID = 7 ;
var MOUSE_PICK_LASTPT_PROC_ID = 8 ;
var MOUSE_STATUSBAR_PROC_ID = 9 ;

var MULTITHREADING_OBJ_WORKAREA_NONE = 0.0 ;
var MULTITHREADING_OBJ_WORKAREA_RENDERING = 1.0 ;
var MULTITHREADING_OBJ_WORKAREA_DICTIONARY = 2.0 ;
var MULTITHREADING_OBJ_WORKAREA_CANVAS_REDRAWING = 3.0 ;

var ITEM_TYPE_CIRCLE = 0, ITEM_TYPE_MOBIUS = 1 ;

var OBJ_UNKNOWN_CLASS = 0 ;
var OBJ_STD_CLASS = 1 ;
var OBJ_USER_DEF_CLASS = 2 ;
var OBJ_FORMULA_CLASS = 3 ;

var OPERATOR_UNARY = 1, OPERATOR_BINARY = 2 ;

var OTHER_NONE = 0, OTHER_ZOOM = 1 ;

var OUTPUT_FILE_INCLUSION = -2 ;
var OUTPUT_NONE = 0 ;
var OUTPUT_SCREEN = 1 ;
var OUTPUT_TERMINAL = 2 ;
var OUTPUT_SCRIPT = 4 ;
var OUTPUT_CONSOLE = 8 ;
var OUTPUT_VAR = 16 ;
var OUTPUT_HELP = 32 ;
var OUTPUT_TEXT = 64 ;
var OUTPUT_HTML = 128 ;
var OUTPUT_CANVAS = 256 ;
var OUTPUT_FILE = 512 ;
var OUTPUT_FUNCTION = 1024 ;
var OUTPUT_SCRIPT_EDITOR = 2048 ;
var OUTPUT_SPECIAL_FX = 4096 ;
var OUTPUT_LOG = 8192 ;

var PANELS_STATUS_FULL_LEFT = 1 ;
var PANELS_STATUS_FULL_RIGHT = 2 ;
var PANELS_STATUS_BOTH = 3 ;
var PANELS_STATUS_SIZE_MANAGER = 4 ;
var PANELS_STATUS_LEFT_PERCENTAGE = 5 ;
var PANELS_STATUS_RIGHT_PERCENTAGE = 6 ;

var PLUGIN_INPUT_MODE_NONE = 0 ;
var PLUGIN_INPUT_MODE_RIGID = 1 ;
var PLUGIN_INPUT_MODE_FREE = 2 ;

var POPUP_NO_ID = "noid" ;
var POPUP_STAND_STILL = 0 ;
var POPUP_MOVE = 1 ;
var POPUP_REC_POSITION = 2 ;
var POPUP_SEARCH_BY_UNIQUE_ID = 1 ;
var POPUP_SEARCH_BY_DIV_ID = 2 ;
var POPUP_SEARCH_BY_CAPTION = 4 ;
var POPUP_SEARCH_BY_STATUS = 8 ;
var POPUP_SEARCH_BY_VISIBLE = 16 ;
var POPUP_SEARCH_BY_HEIGHT = 32 ;
var POPUP_SEARCH_BY_SUBSET = 64 ;
var POPUP_SEARCH_BY_BASE_ID = 128 ;
var POPUP_SEARCH_BY_SUBSET = 256 ;

var PROCESS_NONE = 0, PROCESS_BREADTHFIRST = 1;
var PROCESS_RANDOM = 2, PROCESS_INDEXSEARCH = 3 ;

var PROCESS_NONE_CMD_DEF = "none" ;
var PROCESS_BREADTHFIRST_CMD_DEF = "breadthfirst" ;
var PROCESS_FIXEDPOINTS_CMD_DEF = "fixedpoints" ;
var PROCESS_RANDOM_CMD_DEF = "random" ;
var PROCESS_INDEXSEARCH_CMD_DEF = "indexsearch" ;

var RENDERING_LINE = "line" ;
var RENDERING_RECT = "rect" ;

var REPETEND_TEST_ERR_UNDET = 0 ;
var REPETEND_TEST_ERR_OK = 1 ;
var REPETEND_TEST_ERR_EMPTY_GROUP = -1 ;
var REPETEND_TEST_ERR_INVALID_CHARS = -2 ;
var REPETEND_TEST_ERR_MISSING_ALPHABET = -3 ;
var REPETEND_TEST_ERR_MISSING_INPUT_WORD = -4 ;
var REPETEND_TEST_ERR_MISSING_INPUT_CONTAINER = -5 ;

var RESET_NONE = 0 ;
var RESET_GENERALS = 1 ;
var RESET_BIP = 2 ;
var RESET_TERMINAL = 4 ;
var RESET_COORDS = 8 ;
var RESET_PLUGINS = 16 ;
var RESET_GENS_SET = 32 ;
var RESET_DICT = 64 ;
var RESET_ALL = ~RESET_NONE ;

var RNG_BUILT_IN = 0 ;
var RNG_UNIFORM = 1 ;
var RNG_NORMAL = 2 ;
var RNG_EXPONENTIAL = 3 ;
var RNG_POISSON = 4 ;
var RNG_GAMMA = 5 ;
var RNG_MERSENNE_TWISTER = 6 ;
var RNG_SINE = 7 ;
var RNG_COMPLEMENTARY_MULTIPLY_WITH_CARRY = 8 ;
var RNG_LINEAR_CONGRUENT = 9 ;
var RNG_MARSAGLIA_ZAMAN = 10 ;

var ROLE_NONE = 0, ROLE_GRID = 1, ROLE_RENDERING = 2, ROLE_FREEDRAW = 3, ROLE_WORK = 4, ROLE_BIP = 5 ;

var RUN_CODE_FROM_UNKNOWN = 0;
var RUN_CODE_FROM_TERMINAL = 1;
var RUN_CODE_FROM_OUTER_SRC = 2 ;

var DISCRETENESS_LOCUS_NONE = 0 ;

var TERMINAL_CMD_MODE_NONE = 0 ;
var TERMINAL_CMD_MODE_ACTIVE = 1 ; // when cmds are called directly
var TERMINAL_CMD_MODE_PASSIVE = 2 ; // when cmds are called by another command
var TERMINAL_CMD_MODE_INCLUSION = 3 ; // when cmds are called by framework inclusion process

var TERMINAL_OPERATOR_DUMP_TO = "->" ;
var TERMINAL_OPERATOR_DUMP_FROM = "<-" ;
var TERMINAL_TRANSFER_TO_OPERATOR = ">>" ;
var TERMINAL_TRANSFER_FROM_OPERATOR = "<<" ;

var TERMINAL_SCRIPT_INPUT = 1 ;

var ZOOM_PULL_COORDS = 0, ZOOM_SET_COORDS = 1 ;

// defs at last, in order to let the system load all above entries first

var _glob_constr_mode_defs_array = [] ;
    _glob_constr_mode_defs_array[''+CONSTRUCTION_NONE] = "no construction mode" ;
    _glob_constr_mode_defs_array[''+CONSTRUCTION_TILING] = "tiling" ;
    _glob_constr_mode_defs_array[''+CONSTRUCTION_LIMITSET] = "limitset" ;

var _glob_drawentity_defs_array = [] ;
    _glob_drawentity_defs_array[''+DRAWENTITY_INVERSION_CIRCLE] = DRAWENTITY_INVERSION_CIRCLE_DEF ;
    _glob_drawentity_defs_array[''+DRAWENTITY_ISOMETRIC_CIRCLE] = DRAWENTITY_ISOMETRIC_CIRCLE_DEF ;
    _glob_drawentity_defs_array[''+DRAWENTITY_PIXEL] = DRAWENTITY_PIXEL_DEF ;
    _glob_drawentity_defs_array[''+DRAWENTITY_POLYLINE] = DRAWENTITY_POLYLINE_DEF ;
    _glob_drawentity_defs_array[''+DRAWENTITY_POINT] = DRAWENTITY_POINT_DEF ;

var _glob_figures_defs_array = [] ;
    _glob_figures_defs_array[''+FIGURE_CLASS_CIRCLE] = "circle" ;
    _glob_figures_defs_array[''+FIGURE_CLASS_LINE] = "line" ;
    _glob_figures_defs_array[''+FIGURE_CLASS_POINT] = "point" ;
    _glob_figures_defs_array[''+FIGURE_CLASS_RECT] = "rect" ;

var _glob_fixedpoints_defs_array = [] ;
    _glob_fixedpoints_defs_array[''+FIXEDPOINT_NONE] = "none" ;
    _glob_fixedpoints_defs_array[''+FIXEDPOINT_SINK] = "sink" ;
    _glob_fixedpoints_defs_array[''+FIXEDPOINT_SOURCE] = "source" ;
    _glob_fixedpoints_defs_array[''+FIXEDPOINT_NEUTRAL] = "neutral" ;
    _glob_fixedpoints_defs_array[''+FIXEDPOINT_USERDEFINED] = "user-defined input" ;

var _glob_fixedpt_io_defs_array = [] ;
    _glob_fixedpt_io_defs_array[''+FIXEDPOINTS_IO_NONE] = "no fixed point option" ;
    _glob_fixedpt_io_defs_array[''+FIXEDPOINTS_IO_INPUT] = "fixed point input" ;

var _glob_method_defs_array = [] ;
    _glob_method_defs_array[''+METHOD_NONE] = METHOD_NONE_DEF ;
    _glob_method_defs_array[''+METHOD_INVERSION] = METHOD_INVERSION_DEF ;
    _glob_method_defs_array[''+METHOD_ALGEBRAIC] = METHOD_ALGEBRAIC_DEF ;

var _glob_method_cmd_defs_array = [] ;
    _glob_method_cmd_defs_array[''+METHOD_NONE] = METHOD_NONE_CMD_DEF ;
    _glob_method_cmd_defs_array[''+METHOD_INVERSION] = METHOD_INVERSION_CMD_DEF ;
    _glob_method_cmd_defs_array[''+METHOD_ALGEBRAIC] = METHOD_ALGEBRAIC_CMD_DEF ;

var _glob_plane_defs_array = [] ;
    _glob_plane_defs_array[''+NO_PLANE] = "no plane" ;
    _glob_plane_defs_array[''+Z_PLANE] = "Z-plane" ;
    _glob_plane_defs_array[''+W_PLANE] = "W-plane" ;
    _glob_plane_defs_array[''+BIP_BOX] = "Bip box" ;
    _glob_plane_defs_array[''+D_LOCUS] = "Discreteness locus" ;
    _glob_plane_defs_array[''+ALL_PLANES] = "all planes" ;
    _glob_plane_defs_array[''+CUSTOM_PLANE] = "Custom plane" ;

var _glob_plane_cmd_type_array = [] ;
		_glob_plane_cmd_type_array['zplane'] = Z_PLANE ;
		_glob_plane_cmd_type_array['wplane'] = W_PLANE ;
		_glob_plane_cmd_type_array['bipbox'] = BIP_BOX ;
		_glob_plane_cmd_type_array['dlocus'] = D_LOCUS ;
		_glob_plane_cmd_type_array['custom'] = CUSTOM_PLANE ;
		_glob_plane_cmd_type_array['allplanes'] = ALL_PLANES ;

var _glob_plane_cmd_defs_array = [] ;
    _glob_plane_cmd_defs_array[''+Z_PLANE] = "zplane" ;
    _glob_plane_cmd_defs_array[''+W_PLANE] = "wplane" ;
    _glob_plane_cmd_defs_array[''+BIP_BOX] = "bipbox" ;
    _glob_plane_cmd_defs_array[''+D_LOCUS] = "dlocus" ;
    _glob_plane_cmd_defs_array[''+CUSTOM_PLANE] = "custom" ;
    _glob_plane_cmd_defs_array[''+ALL_PLANES] = "all planes" ;

var _glob_proc_defs_array = [] ;
    _glob_proc_defs_array[''+PROCESS_NONE] = "no process" ;
    _glob_proc_defs_array[''+PROCESS_BREADTHFIRST] = "breadth first" ;
    _glob_proc_defs_array[''+PROCESS_INDEXSEARCH] = "index search" ;
    _glob_proc_defs_array[''+PROCESS_RANDOM] = "random" ;