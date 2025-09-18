package com.kaushik.restapis.bookstore_management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaushik.restapis.bookstore_management.entity.Author;
import com.kaushik.restapis.bookstore_management.repository.AuthorRepository;

@Service
@Transactional
public class AuthorService {

    @Autowired
    private AuthorRepository authorRepository;

    // Remove constructor when using @Autowired
    // AuthorService(AuthorRepository authorRepository) {
    //     this.authorRepository = authorRepository;
    // }
    //Create new author 
    public Author createAuthor(Author author) {
        //check if author with same name exists 
        if (authorRepository.existsByNameIgnoreCase(author.getName())) {
            throw new IllegalArgumentException("Author with name " + author.getName() + " already exists");
        }
        return authorRepository.save(author);
    }

    //Get all authors
    @Transactional(readOnly = true)
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    //Get Authors with pagination
    @Transactional(readOnly = true)
    public Page<Author> getAllAuthors(Pageable pageable) {
        return authorRepository.findAll(pageable);
    }

    //Get author by id
    @Transactional(readOnly = true)
    public Author getAuthorById(Long id) {
        return authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author with id " + id + " not found"));
    }

    //Update Author
    public Author updateAuthor(Long id, Author updatedAuthor) {
        Author author = getAuthorById(id);

        // Check for duplicate name (excluding current author)
        Optional<Author> existingAuthor = authorRepository.findByNameIgnoreCase(updatedAuthor.getName());
        if (existingAuthor.isPresent() && !existingAuthor.get().getId().equals(id)) {
            throw new IllegalArgumentException("Author with name " + updatedAuthor.getName() + " already exists");
        }

        author.setName(updatedAuthor.getName());
        author.setBio(updatedAuthor.getBio());
        author.setNationality(updatedAuthor.getNationality());

        return authorRepository.save(author);
    }

    //Delete Author 
    public void deleteAuthor(Long id) {
        Author author = getAuthorById(id);
        authorRepository.delete(author);
    }

    //Search authors by name
    @Transactional(readOnly = true)
    public List<Author> searchAuthorsByName(String name) {
        return authorRepository.findByNameContainingIgnoreCase(name);
    }

    //Search authors by name with pagination
    @Transactional(readOnly = true)
    public Page<Author> searchAuthorsByName(String name, Pageable pageable) {
        return authorRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    //Get author by Nationality
    @Transactional(readOnly = true)
    public List<Author> getAuthorsByNationality(String nationality) {
        return authorRepository.findByNationalityIgnoreCase(nationality);
    }

    //Get all distinct nationalities
    @Transactional(readOnly = true)
    public List<String> getAllNationalities() {
        return authorRepository.findAllNationalities();
    }
}
