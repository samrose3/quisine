import React, { useReducer } from 'react'
import axios from 'axios'
import set from 'lodash/fp/set'
import { Image } from 'react-feather'
import VisuallyHidden from '@reach/visually-hidden'

const STATUS = {
  DEFAULT: 'DEFAULT',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

const initialState = {
  status: STATUS.DEFAULT,
  ingredient: '',
  post: {
    title: '',
    src: '',
    ingredients: [],
  },
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'UPDATE_STATE':
      return set(payload.path, payload.value, state)
    case 'UPDATE_STATUS':
      return set('status', payload.value, state)
    case 'ADD_INGREDIENT': {
      let ingredients = [
        ...state.post.ingredients,
        state.ingredient.toLowerCase(),
      ]
      return set('post.ingredients', ingredients, state)
    }
    case 'REMOVE_INGREDIENT': {
      const idx = state.post.ingredients.indexOf(payload.value)
      let ingredients = [...state.post.ingredients]
      ingredients.splice(idx, 1)
      return set('post.ingredients', ingredients, state)
    }
    default:
      return state
  }
}

const NewPostForm = ({ onSubmit, onCancel }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const updateState = path => e =>
    dispatch({ type: 'UPDATE_STATE', payload: { path, value: e.target.value } })

  const updateStatus = value => {
    dispatch({
      type: 'UPDATE_STATUS',
      payload: { value },
    })
  }

  const upload = async e => {
    updateStatus(STATUS.PENDING)

    const files = e.target.files
    const formData = new FormData()
    formData.append('file', files[0])
    formData.append('upload_preset', 'quisine')

    const { data, error } = await axios.post(
      'https://api.cloudinary.com/v1_1/samrose3/image/upload',
      formData
    )

    if (error) return updateStatus(STATUS.ERROR)
    updateStatus(STATUS.SUCCESS)

    dispatch({
      type: 'UPDATE_STATE',
      payload: { path: 'post.src', value: data.secure_url },
    })
  }

  const add = () => {
    if (state.post.ingredients.includes(state.ingredient)) return

    dispatch({ type: 'ADD_INGREDIENT' })
    dispatch({
      type: 'UPDATE_STATE',
      payload: { path: 'ingredient', value: '' },
    })
  }

  const remove = ingredient => () => {
    dispatch({ type: 'REMOVE_INGREDIENT', payload: { value: ingredient } })
  }

  const handleOnSubmit = async e => {
    e.preventDefault()
    if (state.status !== STATUS.SUCCESS) return

    const { data, error } = await axios.post('api/create-post', state.post)

    if (error) return updateStatus(STATUS.ERROR)

    console.log(data)
    onSubmit(e)
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <label
        htmlFor="file"
        className="flex items-center justify-center w-full h-64 mx-auto mt-3 mb-6 font-semibold text-gray-800 bg-gray-100 bg-center bg-no-repeat bg-cover border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
        css={{
          backgroundImage: `url(${state.post.src})`,
        }}
      >
        {!state.post.src && (
          <>
            <Image className="mr-2" aria-hidden /> Upload image
          </>
        )}
        <VisuallyHidden>
          <input
            type="file"
            id="file"
            name="file"
            placeholder="Upload an image"
            required
            onChange={upload}
          />
        </VisuallyHidden>
      </label>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-1 font-semibold">
          Title
        </label>
        <input
          className="input"
          type="text"
          name="title"
          id="title"
          required
          value={state.post.title}
          placeholder="Blueberry Oatmeal"
          onChange={updateState('post.title')}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="ingredient" className="block mb-1 font-semibold">
          Ingredients
        </label>
        <input
          className="mr-2 input"
          type="text"
          name="ingredient"
          id="ingredient"
          value={state.ingredient}
          placeholder="blueberries"
          onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
          onChange={updateState('ingredient')}
        />
        <button type="button" onClick={add} className="button">
          Add
        </button>
      </div>
      <div>
        {state.post.ingredients.length ? (
          state.post.ingredients.map(ingredient => (
            <span
              key={ingredient}
              className="inline-block px-3 py-1 my-1 mr-2 text-sm font-semibold text-gray-600 bg-gray-300 border border-transparent rounded-full"
            >
              {ingredient}
              <button className="ml-1 text-xs" onClick={remove(ingredient)}>
                <VisuallyHidden>Remove</VisuallyHidden>
                <span aria-hidden>×</span>
              </button>
            </span>
          ))
        ) : (
          <span className="inline-block px-3 py-1 my-1 mr-2 text-sm font-semibold text-gray-600 bg-gray-100 border border-gray-600 border-dashed rounded-full opacity-50 bo">
            ingredient
          </span>
        )}
      </div>
      <div className="flex justify-end mt-8">
        <button className="mr-3 button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          Submit
        </button>
      </div>
    </form>
  )
}

export default NewPostForm
