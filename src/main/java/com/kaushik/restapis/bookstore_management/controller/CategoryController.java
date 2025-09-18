package com.kaushik.restapis.bookstore_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaushik.restapis.bookstore_management.entity.Category;
import com.kaushik.restapis.bookstore_management.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    //Create a new category
    public ResponseEntity<Category> createCategory(@Valid @RequestBody Category category) {
        Category savedCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(savedCategory, HttpStatus.CREATED);
    }

    //get all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        if (search != null && !search.isEmpty()) {
            if (page >= 0 && size > 0) {
                Sort sort = sortDir.equalsIgnoreCase("desc")
                        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
                Pageable pageable = PageRequest.of(page, size, sort);
                Page<Category> categoryPage = categoryService.searchCategoriesByName(search, pageable);
                return new ResponseEntity<>(categoryPage.getContent(), HttpStatus.OK);
            }
        } else {
            List<Category> categories = categoryService.getAllCategories();
            return new ResponseEntity<>(categories, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    //Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    public ResponseEntity<Category> getCategoryByIdEntity(Long id) {
        Category category = categoryService.getCategoryById(id);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }

    //update category
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @Valid @RequestBody Category categoryDetails) {
        Category updatedCategory = categoryService.updateCategory(id, categoryDetails);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    //delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    //Search categories by name
    @GetMapping("/search")
    public ResponseEntity<List<Category>> searchCategoriesByName(@RequestBody String name) {
        List<Category> categories = categoryService.searchCategoriesByName(name);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
}
