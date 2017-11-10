const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');
const babel = require('gulp-babel');
const clean = require('gulp-clean');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4();
}
var hashCSS = '';
var hashJS = '';


// Watch

gulp.task('scss', function() {
  return gulp.src('src/css/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
});

gulp.task('watch', function() {
  gulp.watch('src/css/components/*.scss', ['scss']);
});



// Build

gulp.task('css', function() {
  hashCSS = guid();

  return gulp.src('src/css/main.css')
    .pipe(concatCss("main-" + hashCSS + ".css"))
    .pipe(cleanCSS({debug: true}))
    .pipe(gulp.dest('public/css'));
});


gulp.task('js', function() {
  hashJS = guid();

  return gulp.src(['src/js/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('main-' + hashJS + '.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('html', function() {
  gulp.src('src/index.html')
    .pipe(htmlreplace({
      'css': 'css/main-' + hashCSS + '.css',
      'js': {
        'src': 'js/main-' + hashJS + '.js',
        'tpl': '<script src="%s"></script>'
      }
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('clean', function () {
  return gulp.src('public', {read: false})
    .pipe(clean());
});

gulp.task('build', ['clean', 'css', 'js', 'html']);
