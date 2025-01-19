import pandas as pd
from sklearn.metrics.pairwise import linear_kernel
from sklearn.feature_extraction.text import CountVectorizer


movies = pd.read_csv("recommendation_files/movies.csv")
books = pd.read_csv("recommendation_files/books.csv")


def recommend_movies(movie_name, top_n=5):

    movies["combined_features"] = movies["Genres"] + " " + movies["Title"]

    vectorizer = CountVectorizer()
    matrix = vectorizer.fit_transform(movies["combined_features"].fillna(""))

    cosine_sim = linear_kernel(matrix, matrix)

    try:
        movie_index = movies[
            movies["Title"].str.contains(movie_name, case=False, na=False)
        ].index[0]
    except IndexError:
        return ["Movie not found."]

    similar_movies = list(enumerate(cosine_sim[movie_index]))
    sorted_movies = sorted(similar_movies, key=lambda x: x[1], reverse=True)

    return [movies.iloc[i[0]].Title for i in sorted_movies[1 : top_n + 1]]


def recommend_books(book_name, top_n=5):

    books["combined_features"] = (
        books["Genres"].fillna("") + " " + books["Book-Title"].fillna("")
    )
    vectorizer = CountVectorizer()
    matrix = vectorizer.fit_transform(books["combined_features"])

    cosine_sim = linear_kernel(matrix, matrix)

    try:
        book_index = books[
            books["Book-Title"].str.contains(book_name, case=False, na=False)
        ].index[0]
    except IndexError:
        return ["Book not found."]

    similar_books = list(enumerate(cosine_sim[book_index]))
    sorted_books = sorted(similar_books, key=lambda x: x[1], reverse=True)

    return [books.iloc[i[0]]["Book-Title"] for i in sorted_books[1 : top_n + 1]]
