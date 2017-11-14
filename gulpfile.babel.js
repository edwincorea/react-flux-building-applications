import gulp from "gulp";
import connect from "gulp-connect"; //Runs a local dev server
import open from "gulp-open"; //Open a URL in a web browser
import browserify from "browserify"; // Bundles JS
import babelify from "babelify";  // Transforms React JSX to JS
import es2015 from "babel-preset-es2015";
import reactify from "babel-preset-react";
import source from "vinyl-source-stream"; // Use conventional text streams with Gulp
import concat from "gulp-concat"; //Concatenates files
import lint from "gulp-eslint"; //Lint JS files, including JSX

var config = {
    port: 9005,
    devBaseUrl: "http://localhost",
    paths: {
        html: "./src/*.html",
        js: ["./src/**/*.js", "!node_modules/**"],
        images: "./src/images/*",
        css: [
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "node_modules/bootstrap/dist/css/bootstrap-theme.min.css",
            "node_modules/toastr/toastr.css"
        ],
        dist: "./dist",
        mainJs: "./src/main.js"
    }
};

//Start a local development server
gulp.task("connect", function() {
    connect.server({
        root: ["dist"],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task("open", ["connect"], function() {
    gulp.src("dist/index.html")
        .pipe(open({ uri: config.devBaseUrl + ":" + config.port + "/"}));
});

gulp.task("html", function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task("js", function() {
    browserify(config.paths.mainJs)
        .transform(babelify, {
            global: true,
            babelrc: false,                        
            "extensions": [
                ".tsx", ".ts", ".jsx", ".js" 
            ],
            presets: [
                reactify
                , es2015
            ]             
        })
        .bundle()
        .on("error", console.error.bind(console))
        .pipe(source("bundle.js"))
        .pipe(gulp.dest(config.paths.dist + "/scripts"))
        .pipe(connect.reload());
});

gulp.task("css", function() {
    gulp.src(config.paths.css)
        .pipe(concat("bundle.css"))
        .pipe(gulp.dest(config.paths.dist + "/css"));
});

// Migrates images to dist folder
// Note that I could even optimize my images here
gulp.task("images", function () {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + "/images"))
        .pipe(connect.reload());

    //publish favicon
    gulp.src("./src/favicon.ico")
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task("lint", function() {
    return gulp.src(config.paths.js)
    //.pipe(lint({config: "eslint.config.json"}))
        .pipe(lint({config: ".eslintrc.json"}))
        .pipe(lint.format())
        .pipe(lint.failAfterError());
});

gulp.task("watch", function() {
    gulp.watch(config.paths.html, ["html"]);
    gulp.watch(config.paths.js, ["js", "lint"]);
});

gulp.task("default", ["html", "js", "css", "images", "open", "watch"]);