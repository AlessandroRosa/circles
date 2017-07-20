function inline_worker( _inline_blob_code, _import_ext_scripts_array )
{
    this.blob = new Blob( [ _inline_blob_code ] );
    this.blobURL = window.URL.createObjectURL( this.blob );
    this.worker = new Worker( this.blobURL );
    var _l = window.location.href.split( "/" ) ;
    this.location = _l.slice( 0, _l.length - 1 ).join( "/" ) + "/" ;

    this.worker.postMessage( { id : "import",
                               location : this.location,
                               scripts : _import_ext_scripts_array }
                           );

    // this is the listener to capture messages from above custom script
    this.worker.onmessage = function(e)
    {
        switch( e.data.id )
        {
            case "output": inline_worker_output_member( e.data.ret ); break ;
            case "start": inline_worker_start_member( e.data.ret ); break ;
            case "end": inline_worker_end_member( e.data.ret ); break ;
            case "stop": inline_worker_stop_member( e.data.ret ); this.terminate(); break ;
            default: break ;
        }
    };
    
    this.vars_array = null ;
}

inline_worker.prototype.run = function()
{
    this.worker.postMessage( { id : "run" } );
    window.URL.revokeObjectURL( this.blobURL );
}

inline_worker.prototype.init_vars = function( _vars_array )
{
    this.worker.postMessage( { id : "init", vars : _vars_array } );
    window.URL.revokeObjectURL( this.blobURL );
}

inline_worker.prototype.terminate = function() { this.worker.postMessage( { id : "stop" } ); this.worker.terminate(); }
inline_worker.prototype.stop = function()      { this.worker.postMessage( { id : "stop" } ); this.worker.terminate(); }