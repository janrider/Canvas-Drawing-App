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

gulp.task('scss', function() {
  return gulp.src('src/css/scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
});

gulp.task('css', function() {
  return gulp.src(['src/css/_vendors/**/*', 'src/css/main.css'])
    .pipe(concatCss("main.min.css"))
    .pipe(cleanCSS({debug: true}))
    .pipe(gulp.dest('public/css'));
});

gulp.task('js-common', function() {
  return gulp.src([
    'src/js/app/*.js',
    'src/js/app/vendor/*.js',
    'src/js/app/Services/*.js',
    'src/js/app/common/*.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/js'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('js-misc', function() {
  return gulp.src(['src/js/app/misc/**/*.js',])
    .pipe(sourcemaps.init())
    .pipe(concat('misc.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/js'))
    .pipe(gulp.dest('public/js'));
});
gulp.task('js', ['js-common', 'js-misc']);


gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest('public/img'));
});

gulp.task('views', function() {
  return gulp.src(['src/views/**/*'])
    .pipe(gulp.dest('public/views'));
});

gulp.task('main', function() {
  return gulp.src(['src/*.txt', 'src/*.php'])
    .pipe(gulp.dest('public'));
});

gulp.task('watch', function() {
  gulp.watch('src/css/scss/*.scss', ['scss']);
});

gulp.task('html', function() {
  const date = new Date();

  gulp.src('src/index.html')
    .pipe(htmlreplace({
      'css': 'css/main.min.css?t=' + date.getTime(),
      'js': {
        'src': 'js/app.min.js?t=' + date.getTime(),
        'tpl': '<script src="%s" defer></script>'
      },
      'miscjs': {
        'src': 'js/misc.min.js?t=' + date.getTime(),
        'tpl': '<script src="%s" defer></script>'
      }
    }))
    .pipe(gulp.dest('public'));
});

gulp.task('build', ['css', 'js', 'img', 'fonts', 'main', 'views', 'html']);
