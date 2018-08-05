import {
	LOAD_MEDIA_REQUEST,
	LOAD_MEDIA_REQUEST_FAILURE,
	LOAD_MEDIA_REQUEST_SUCCESS,

	MEDIA_DRAGLEAVE,
	MEDIA_DRAGOVER
} from './types';

const requestMediaLoad = meta => ({
	type: LOAD_MEDIA_REQUEST,
	meta
});

const emitMediaLoadFailed = meta => ({
	type: LOAD_MEDIA_REQUEST_FAILURE,
	meta
});

const emitMediaLoadSuccess = meta => ({
	type: LOAD_MEDIA_REQUEST_FAILURE,
	meta
});

const emitMediaDragover = () => ({
	type: MEDIA_DRAGOVER
});

const emitMediaDragleave = () => ({
	type: MEDIA_DRAGLEAVE
})
