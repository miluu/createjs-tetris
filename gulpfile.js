var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var util = require('gulp-util');
var webpack = require('webpack-stream');
var connect = require('gulp-connect');
var named = require('vinyl-named');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var base64 = require('gulp-base64');
var ejs = require('gulp-ejs');
var rename = require('gulp-rename');
var del = require('del');
var minimist = require('minimist');

var env = minimist(process.argv).env || "development";
var isProd = env === 'production';

var webpackConfig = isProd
  ? require('./webpack.prod.config.js')
  : require('./webpack.dev.config.js');
var ejsConfig = require('./ejs.config.js');

gulp.task('clean', function() {
  del(['dist']).then(function(paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

gulp.task('script', function() {
  var entrys = getEntry();
  return gulp.src(entrys)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/script/'))
    .pipe(connect.reload());
});

gulp.task('style', function() {
  var processors = [
    autoprefixer({browsers: [
      'last 4 versions',
      'ie > 7'
    ]})
  ];
  if (isProd) {
    processors.push(cssnano());
  }
  return gulp.src('src/style/*.less')
    .pipe(plumber(function(err) {
      util.log(util.colors.red(err.message));
      this.emit('end');
    }))
    .pipe(isProd
      ? util.noop()
      : sourcemaps.init()
    )
    .pipe(less())
    .pipe(postcss(processors))
    .pipe(base64({
      baseDir: 'src',
      extensions: [/base64\//, /\?base64$/],
      debug: true
    }))
    .pipe(isProd
      ? util.noop()
      : sourcemaps.write('.'))
    .pipe(gulp.dest('dist/style/'))
    .pipe(connect.reload());
});

gulp.task('html', function() {
  return gulp.src('src/template/*.ejs')
    .pipe(plumber())
    .pipe(ejs(ejsConfig))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('dist/images/'))
    .pipe(connect.reload());
});

gulp.task('libs', function() {
  return gulp.src('src/libs/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('dist/libs/'))
    .pipe(connect.reload());
});

gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/'))
    .pipe(connect.reload());
});

gulp.task('server', function(){
  connect.server({
    livereload: true,
    port: 9999,
    root: 'dist'
  });
});

gulp.task('default', ['script', 'style', 'images', 'libs', 'assets', 'html']);

gulp.task('watch', ['default', 'server'], function() {
  var scriptWatcher = gulp.watch(['src/script/**/*'], ['script']);
  var styleWatcher = gulp.watch(['src/style/**/*'], ['style']);
  var imagesWatcher = gulp.watch(['src/images/**/*'], ['images']);
  var libsWatcher = gulp.watch(['src/libs/**/*'], ['libs']);
  var assetsWatcher = gulp.watch(['src/assets/**/*'], ['assets']);
  var htmlWatcher = gulp.watch(['src/template/**/*'], ['html']);

  scriptWatcher.on('change', function(e) {
    delDistFiles(e, [['.ts', '.js']]);
  });
  styleWatcher.on('change', function(e) {
    delDistFiles(e, [['.less', '.css']]);
  });
  imagesWatcher.on('change', function(e) {
    delDistFiles(e);
  });
  libsWatcher.on('change', function(e) {
    delDistFiles(e);
  });
  assetsWatcher.on('change', function(e) {
    delDistFiles(e);
  });
  htmlWatcher.on('change', function(e) {
    delDistFiles(e, [['.ejs', '.html'], ['template' + path.sep, '']]);
  });
});

function getEntry() {
    var tsPath = 'src/script/';
    var dirs = fs.readdirSync(tsPath);
    var files = [];
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.tsx?$/);
        if (matchs) {
            files.push(path.resolve(tsPath, item));
        }
    });
    return files;
}

function delDistFiles(e, replaceArr) {
  if (e.type === 'deleted') {
    var filePath = path.relative(__dirname, e.path);
    var distFilePath = filePath.replace('src', 'dist')
    replaceArr.forEach(function(replace) {
      distFilePath = distFilePath.replace(replace[0], replace[1]);
    })
    del([distFilePath, distFilePath + '.map']).then(function(paths) {
      console.log('Deleted files and folders:\n', paths.join('\n'));
    });
  }
}