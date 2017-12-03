function circles_lib_angle_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.angle2PI ) === "function" ? _obj.angle2PI() : null ) ; }
function circles_lib_apothem_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.apothem ) === "function" ? _obj.apothem() : null ) ; }
function circles_lib_arc_get_from_obj( _obj, _rad ) { return _obj == null ? null : ( typeof ( _obj.arc ) === "function" ? _obj.arc( _rad ) : null ) ; }
function circles_lib_area_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.area ) === "function" ? _obj.area() : null ) ; }
function circles_lib_argument_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.argument2PI ) === "function" ? _obj.argument2PI() : null ) ; }
function circles_lib_center_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.center ) === "function" ? _obj.center() : null ) ; }
function circles_lib_centroid_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.centroid ) === "function" ? _obj.centroid() : null ) ; }
function circles_lib_conjugate_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.conj ) === "function" ? _obj.conj() : null ) ; }
function circles_lib_corners_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.get_corners ) === "function" ? _obj.get_corners() : null ) ; }
function circles_lib_circumference_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.circumference ) === "function" ? _obj.circumference() : null ) ; }
function circles_lib_diameter_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.diameter ) === "function" ? _obj.diameter() : null ) ; }
function circles_lib_diagonal_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.diagonal ) === "function" ? _obj.diagonal() : null ) ; }
function circles_lib_distance_get_from_obj( _obj, _pt ) { return _obj == null ? null : ( typeof ( _obj.distance ) === "function" ? _obj.distance( _pt ) : null ) ; }
function circles_lib_height_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.height ) === "function" ? _obj.height() : null ) ; }
function circles_lib_length_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.length ) === "function" ? _obj.length() : null ) ; }
function circles_lib_midpoint_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.midpoint ) === "function" ? _obj.midpoint() : null ) ; }
function circles_lib_norm_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.norm ) === "function" ? _obj.norm() : null ) ; }
function circles_lib_perimeter_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.perimeter ) === "function" ? _obj.perimeter() : null ) ; }
function circles_lib_points_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.points ) === "function" ? _obj.points() : null ) ; }
function circles_lib_radius_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.radius ) === "function" ? _obj.radius() : null ) ; }
function circles_lib_rotate_get_from_obj( _obj, _center, _ang ) { return _obj == null ? null : ( typeof ( _obj.rotate ) === "function" ? _obj.rotate( _center, _ang, 0 ) : null ) ; }
function circles_lib_shift_obj( _obj, _shift_x, _shift_y ) { return _obj == null ? null : ( typeof ( _obj.shift ) === "function" ? _obj.shift( _shift_x, _shift_y, 0 ) : null ) ; }
function circles_lib_slope_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.slope ) === "function" ? _obj.slope() : null ) ; }
function circles_lib_width_get_from_obj( _obj ) { return _obj == null ? null : ( typeof ( _obj.width ) === "function" ? _obj.width() : null ) ; }