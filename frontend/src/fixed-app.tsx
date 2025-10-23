import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import {
  Book as BookIcon,
  Person as AuthorIcon,
  Category as CategoryIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { Suspense } from "react";

import "./App.css";
import AuthorList from "./components/AuthorList";
import AuthorForm from "./components/AuthorForm";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import ErrorBoundary from "./components/ErrorBoundary";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function HomePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Bookstore Management
      </Typography>
      <Typography variant="body1" paragraph>
        Use the navigation menu to manage books, authors, and categories.
      </Typography>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div">
                Bookstore Management
              </Typography>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 240,
                boxSizing: "border-box",
                marginTop: "64px",
              },
            }}
          >
            <Box sx={{ overflow: "auto" }}>
              <List>
                <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>

                <ListItemButton component={Link} to="/books">
                  <ListItemIcon>
                    <BookIcon />
                  </ListItemIcon>
                  <ListItemText primary="Books" />
                </ListItemButton>

                <ListItemButton component={Link} to="/authors">
                  <ListItemIcon>
                    <AuthorIcon />
                  </ListItemIcon>
                  <ListItemText primary="Authors" />
                </ListItemButton>

                <ListItemButton component={Link} to="/categories">
                  <ListItemIcon>
                    <CategoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Categories" />
                </ListItemButton>
              </List>
            </Box>
          </Drawer>

          <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10 }}>
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books" element={<BookList />} />
                  <Route path="/books/add" element={<BookForm />} />
                  <Route path="/authors" element={<AuthorList />} />
                  <Route path="/categories" element={<CategoryList />} />
                  <Route path="/categories/add" element={<CategoryForm />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
