import React, { useEffect, useState } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import { Plus } from 'react-feather'
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button'
import Modal from './modal'
import NewPostForm from './new-post'

const Navbar = ({ onNewPost }) => {
  const user = netlifyIdentity.currentUser()
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(user))
  const [showDialog, setShowDialog] = useState(false)

  const open = () => setShowDialog(true)
  const close = () => setShowDialog(false)

  useEffect(() => {
    netlifyIdentity.init()
    netlifyIdentity.on('login', () => {
      setIsLoggedIn(true)
      netlifyIdentity.close()
    })
    netlifyIdentity.on('logout', () => setIsLoggedIn(false))
  }, [])

  return (
    <div className="border-b border-gray-400">
      <div className="relative flex items-center justify-between h-16 max-w-2xl px-6 py-2 m-auto">
        <div className="text-2xl font-cursive">Quisine</div>
        <div
          className="absolute"
          css={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <input type="text" placeholder="Search" className="input" />
        </div>
        {isLoggedIn ? (
          <div className="flex items-center">
            <button className="mr-3" onClick={open}>
              <Plus size={18} />
            </button>
            <Modal
              isOpen={showDialog}
              onDismiss={close}
              aria-label="Create a new post"
            >
              <NewPostForm
                onSubmit={() => {
                  close()
                  onNewPost()
                }}
                onCancel={close}
              />
            </Modal>
            <Menu>
              <MenuButton className="flex items-center">
                <span
                  className="inline-block w-8 h-8 mr-1 bg-gray-500 bg-center bg-cover rounded-full"
                  css={{
                    backgroundImage: `url(https://unavatar.now.sh/${user.email})`,
                  }}
                />
                <span aria-hidden className="dropdown-caret" />
              </MenuButton>
              <MenuList>
                <MenuItem onSelect={() => {}}>Profile</MenuItem>
                <MenuItem onSelect={() => {}}>Settings</MenuItem>
                <MenuItem onSelect={() => netlifyIdentity.logout()}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        ) : (
          <button
            className="px-3 py-2 text-sm font-semibold rounded hover:bg-gray-200"
            onClick={() => netlifyIdentity.open('login')}
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar
