import gulp from "gulp";
import concat from 'gulp-concat';
import prefix from 'gulp-autoprefixer';
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

const compileSass = () => {
    return gulp
        .src("scss/mythic-bastionland.scss")
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(prefix({ cascade: false }))
        .pipe(concat("mythic-bastionland.css"))
        .pipe(gulp.dest("./css"));
}

const watchSass = () => {
    gulp.watch("scss/**/*.scss", compileSass)
}

export default gulp.series(gulp.parallel(compileSass), watchSass);
export const buildCSS = gulp.series(compileSass);
