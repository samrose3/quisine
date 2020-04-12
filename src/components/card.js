import React from 'react'
import compose from 'lodash/fp/compose'
import { formatDistanceToNow, isToday } from 'date-fns'
import { format } from 'date-fns/fp'
import { MoreHorizontal } from 'react-feather'

const formatRelative = compose(d => `${d} ago`, formatDistanceToNow)
const formatDate = format('MMM dd, yyyy')

const Card = ({ title, created, ingredients = [], src = '' }) => (
  <div className="w-full h-full max-w-full pb-2 mb-4 overflow-hidden bg-top rounded sm:max-w-sm sm:shadow-lg sm:mb-16">
    <div className="flex items-center px-6 py-4">
      <div className="w-8 h-8 bg-gray-500 rounded-full" />
      <div className="flex-1 ml-4 text-base font-semibold">username</div>
      <div className="text-gray-500">
        <MoreHorizontal />
      </div>
    </div>
    <div
      className="w-full h-64 bg-gray-300 bg-cover"
      style={{
        backgroundImage: `url(${src})`,
      }}
    />
    <div className="px-6 pt-4 pb-2">
      <div className="mb-2 text-lg font-bold">{title}</div>
      <p className="text-base text-gray-600">
        {isToday(created) ? formatRelative(created) : formatDate(created)}
      </p>
    </div>
    <div className="px-5 py-2">
      {ingredients.map(ingredient => (
        <span
          key={ingredient}
          className="inline-block px-3 py-1 my-1 mr-2 text-sm font-semibold text-gray-600 bg-gray-300 rounded-full"
        >
          {ingredient}
        </span>
      ))}
    </div>
  </div>
)

export default Card
