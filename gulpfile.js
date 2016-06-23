var gulp   = require( 'gulp' ),
    nodemon = require( 'gulp-nodemon');
    
    
 gulp.task('serve',function(){
      return nodemon({
           exec: 'node',
          script:'server.js',
          verbose: true,
          env: { 'NODE_ENV': 'development' },
          ignore: ["data/*", "README.md"] 
    });
 })
