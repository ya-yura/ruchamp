import { Menu, MenuButton, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components";

export default function Event() {
  return (
    <Menu>
    <MenuTrigger disableButtonEnhancement>
      <MenuButton>Example</MenuButton>
    </MenuTrigger>

    <MenuPopover>
      <MenuList>
        <MenuItem>Item a</MenuItem>
        <MenuItem>Item b</MenuItem>
      </MenuList>
    </MenuPopover>
  </Menu>
  )
}
