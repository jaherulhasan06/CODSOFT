from flask import Flask, render_template, request
from recommendation_files.recommendation_logic import recommend_movies, recommend_books

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/movies")
def movies():
    return render_template("movie_recommendations.html")

@app.route("/books")
def books():
    return render_template("book_recommendations.html")

@app.route("/recommend_movies", methods=["POST"])
def get_movie_recommendations():
    movie = request.form.get("movie")
    recommendations = recommend_movies(movie)
    return render_template("movie_recommendations.html", recommendations=recommendations)

@app.route("/recommend_books", methods=["POST"])
def get_book_recommendations():
    book = request.form.get("book")
    recommendations = recommend_books(book)
    return render_template("book_recommendations.html", recommendations=recommendations)

if __name__ == "__main__":
    app.run(debug=True)
