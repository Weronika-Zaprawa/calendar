import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

type LocaleSwitcherProps = {
  onLocaleChange:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  currentLocale: string;
};

function LocaleSwitcher({
  onLocaleChange,
  currentLocale,
}: LocaleSwitcherProps) {
  return (
    <TextField
      select
      variant="standard"
      value={currentLocale}
      onChange={onLocaleChange}
    >
      <MenuItem value="pl-PL">Polski</MenuItem>
      <MenuItem value="en-US">English</MenuItem>
    </TextField>
  );
}

export default LocaleSwitcher;
