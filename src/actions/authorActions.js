import Dispatcher from "../dispatcher/appDispatcher";
import AuthorApi from "../api/authorApi";
import ActionTypes from "../constants/actionTypes";

const AuthorActions = {
    createAuthor: (author) => {
        var newAuthor = AuthorApi.saveAuthor(author);

        //Hey dispatcher, go tell all the stores that an author was just created.
        Dispatcher.dispatch({
            actionType: ActionTypes.CREATE_AUTHOR,
            author: newAuthor
        });
    },

    updateAuthor: (author) => {
        var updatedAuthor = AuthorApi.saveAuthor(author);

        Dispatcher.dispatch({
            actionType: ActionTypes.UPDATE_AUTHOR,
            author: updatedAuthor
        });
    },

    deleteAuthor: (id) => {
        AuthorApi.deleteAuthor(id);

        Dispatcher.dispatch({
            actionType: ActionTypes.DELETE_AUTHOR,
            id: id
        });
    }
};

export default AuthorActions;