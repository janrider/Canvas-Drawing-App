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
  return gulp.src('src/css/main.css')
    .pipe(concatCss("main.min.css"))
    .pipe(cleanCSS({debug: true}))
    .pipe(gulp.dest('public/css'));
});


gulp.task('js', function() {
  return gulp.src(['src/js/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('html', function() {
  gulp.src('src/index.html')
    .pipe(htmlreplace({
      'css': 'css/main.min.css',
      'js': {
        'src': 'js/app.min.js',
        'tpl': '<script src="%s"></script>'
      }
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('build', ['css', 'js', 'html']);
