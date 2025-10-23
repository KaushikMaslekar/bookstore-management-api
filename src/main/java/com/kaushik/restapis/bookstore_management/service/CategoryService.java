package com.kaushik.restapis.bookstore_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaushik.restapis.bookstore_management.entity.Category;
import com.kaushik.restapis.bookstore_management.repository.CategoryRepository;

@Service // Indicate that this class is a service component in Spring
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    //Create new category
    public Category createCategory(Category category) {
        //check if category with same name exists
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new RuntimeException("Category with name " + category.getName() + " already exists");
        }
        return categoryRepository.save(category);
    }

    //Get all categories
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    //Get categories with pagination
    @Transactional(readOnly = true)
    public Page<Category> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    //Get category by id
    @Transactional(readOnly = true)
    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id " + id));
    }

    //update category
    public Category updateCategory(String id, Category categoryDetails) {
        Category category = getCategoryById(id);
        //check if category with same name exists   
        Optional<Category> existingCategory = categoryRepository.findByNameIgnoreCase(categoryDetails.getName());
        if (existingCategory.isPresent() && !existingCategory.get().getId().equals(id)) {
            throw new RuntimeException("Category with name " + categoryDetails.getName() + " already exists");
        }

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        return categoryRepository.save(category);
    }

    //Delete Category
    public void deleteCategory(String id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category); //categoryRepository has delete method because it extends JpaRepository and it interact with database
    }

    //Search categories by name
    @Transactional(readOnly = true)
    public List<Category> searchCategoriesByName(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }

    //search categories by name with pagination
    @Transactional(readOnly = true)
    public Page<Category> searchCategoriesByName(String name, Pageable pageable) {
        return categoryRepository.findByNameContainingIgnoreCase(name, pageable);
    }

}
