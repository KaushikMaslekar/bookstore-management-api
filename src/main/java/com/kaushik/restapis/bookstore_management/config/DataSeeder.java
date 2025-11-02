package com.kaushik.restapis.bookstore_management.config;

import java.math.BigDecimal;
import java.time.Year;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.kaushik.restapis.bookstore_management.entity.Author;
import com.kaushik.restapis.bookstore_management.entity.Book;
import com.kaushik.restapis.bookstore_management.entity.Category;
import com.kaushik.restapis.bookstore_management.repository.AuthorRepository;
import com.kaushik.restapis.bookstore_management.repository.BookRepository;
import com.kaushik.restapis.bookstore_management.repository.CategoryRepository;

@Component
public class DataSeeder implements ApplicationListener<ApplicationReadyEvent> {

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BookRepository bookRepository;

    private boolean seeded = false;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (seeded) {
            return;
        }

        try {
            // Only seed if collections are empty
            if (authorRepository.count() > 0 || categoryRepository.count() > 0 || bookRepository.count() > 0) {
                System.out.println("DataSeeder: data already present, skipping seeding.");
                seeded = true;
                return;
            }

            // Define categories relevant to Computer Science
            String[] categories = new String[]{
                "Algorithms", "Data Structures", "Operating Systems", "Computer Networks", "Databases",
                "Programming Languages", "Theory of Computation", "Computer Architecture", "Compilers",
                "Security", "Software Engineering", "Machine Learning", "Artificial Intelligence",
                "Natural Language Processing", "Distributed Systems", "Graphics", "Human-Computer Interaction",
                "Cloud Computing", "Testing", "DevOps"};

            Map<String, Category> savedCategories = new HashMap<>();
            for (String c : categories) {
                Category cat = new Category(c, c + " books and resources");
                cat = categoryRepository.save(cat);
                savedCategories.put(c, cat);
            }

            // Define a list of authors (common CS authors and notables)
            String[][] authors = new String[][]{
                {"Donald E. Knuth", "Author of The Art of Computer Programming", "USA"},
                {"Andrew S. Tanenbaum", "Operating systems and networking author", "Netherlands"},
                {"Brian W. Kernighan", "Co-author of The C Programming Language", "Canada"},
                {"Dennis M. Ritchie", "Co-creator of C and Unix", "USA"},
                {"Robert Sedgewick", "Algorithms and programming author", "USA"},
                {"Thomas H. Cormen", "Co-author of Introduction to Algorithms", "USA"},
                {"Charles E. Leiserson", "Co-author of Introduction to Algorithms", "USA"},
                {"Ronald L. Rivest", "Co-author of Introduction to Algorithms / RSA", "USA"},
                {"Clifford Stein", "Algorithms researcher", "USA"},
                {"Ian Goodfellow", "Machine learning researcher, GANs", "UK"},
                {"Yoshua Bengio", "Deep learning researcher", "Canada"},
                {"Geoffrey Hinton", "Pioneer in neural networks", "UK"},
                {"Stuart Russell", "AI researcher and textbook author", "UK"},
                {"Peter Norvig", "AI practitioner and author", "USA"},
                {"Edsger W. Dijkstra", "Pioneering CS scientist", "Netherlands"},
                {"Andrew S. Grove", "Computer industry leader", "Hungary"},
                {"Niklaus Wirth", "Pascal creator and CS educator", "Switzerland"},
                {"Michael Sipser", "Theoretical CS author", "USA"},
                {"Alfred Aho", "Compilers pioneer", "USA"},
                {"Jeffrey Ullman", "Databases and compilers", "USA"},
                {"Gerald Jay Sussman", "AI and Scheme author", "USA"},
                {"Ken Thompson", "Unix co-creator", "USA"},
                {"Martin Fowler", "Software engineering author", "UK"},
                {"Fred Brooks", "Software engineering pioneer", "USA"},
                {"Barbara Liskov", "Programming languages and systems", "USA"},
                {"David Patterson", "Computer architecture", "USA"},
                {"John Hennessy", "Computer architecture", "USA"},
                {"John McCarthy", "AI pioneer", "USA"},
                {"Marvin Minsky", "AI pioneer", "USA"},
                {"Richard Stevens", "Networking author", "USA"},
                {"W. Richard Stevens", "UNIX and networking author", "USA"},
                {"Ravi Sethi", "Compilers and theory", "USA"},
                {"Sanjay Ghemawat", "Distributed systems engineer", "USA"},
                {"Leslie Lamport", "Distributed systems researcher", "USA"},
                {"Tim Berners-Lee", "Inventor of the World Wide Web", "UK"},
                {"Donald Norman", "HCI author", "USA"},
                {"Tanenbaum, A.S.", "Educational author", "Netherlands"},
                {"Eli Budur", "Technical writer", "USA"},
                {"Nickolai Zeldovich", "Systems researcher", "USA"},
                {"Seth Bergman", "Education", "USA"},
                {"Rachel Potvin", "Software engineering", "Canada"},
                {"Yann LeCun", "AI researcher", "France"},
                {"Christopher Bishop", "Pattern recognition and ML", "UK"},
                {"Judea Pearl", "Causality researcher", "USA"},
                {"Michael Stonebraker", "Databases researcher", "USA"},
                {"Eric Evans", "Domain-driven design", "USA"},
                {"Sedgewick, R.", "Algorithms", "USA"},
                {"Gayle Laakmann McDowell", "Career and interview books", "USA"},
                {"Jon Kleinberg", "Algorithms and networks", "USA"}
            };

            Map<String, Author> savedAuthors = new HashMap<>();
            for (String[] a : authors) {
                Author author = new Author(a[0], a[1], a[2]);
                author = authorRepository.save(author);
                savedAuthors.put(a[0], author);
            }

            // Create 50 sample CS books
            List<Book> booksToSave = new ArrayList<>();
            String[][] sampleBooks = new String[][]{
                {"The Art of Computer Programming, Vol. 1", "Algorithms", "Donald E. Knuth", "1968"},
                {"The Art of Computer Programming, Vol. 2", "Algorithms", "Donald E. Knuth", "1969"},
                {"The Art of Computer Programming, Vol. 3", "Algorithms", "Donald E. Knuth", "1973"},
                {"Introduction to Algorithms", "Algorithms", "Thomas H. Cormen", "2009"},
                {"Algorithms (4th Edition)", "Algorithms", "Robert Sedgewick", "2011"},
                {"Operating Systems: Design and Implementation", "Operating Systems", "Andrew S. Tanenbaum", "2006"},
                {"Modern Operating Systems", "Operating Systems", "Andrew S. Tanenbaum", "2014"},
                {"Computer Networks", "Computer Networks", "Andrew S. Tanenbaum", "2010"},
                {"TCP/IP Illustrated", "Computer Networks", "W. Richard Stevens", "1994"},
                {"The C Programming Language", "Programming Languages", "Brian W. Kernighan", "1988"},
                {"The Unix Programming Environment", "Programming Languages", "Brian W. Kernighan", "1984"},
                {"Compilers: Principles, Techniques, and Tools", "Compilers", "Alfred Aho", "2006"},
                {"Compilers: Principles and Practice", "Compilers", "Ravi Sethi", "2000"},
                {"Computer Architecture: A Quantitative Approach", "Computer Architecture", "John Hennessy", "2017"},
                {"Computer Organization and Design", "Computer Architecture", "David Patterson", "2017"},
                {"Database System Concepts", "Databases", "Jeffrey Ullman", "2016"},
                {"Readings in Database Systems", "Databases", "Michael Stonebraker", "2011"},
                {"Artificial Intelligence: A Modern Approach", "Artificial Intelligence", "Stuart Russell", "2010"},
                {"Artificial Intelligence: Foundations", "Artificial Intelligence", "Peter Norvig", "2011"},
                {"Deep Learning", "Machine Learning", "Ian Goodfellow", "2016"},
                {"Pattern Recognition and Machine Learning", "Machine Learning", "Christopher Bishop", "2006"},
                {"Probabilistic Graphical Models", "Machine Learning", "Judea Pearl", "2009"},
                {"Distributed Systems: Concepts and Design", "Distributed Systems", "Leslie Lamport", "2014"},
                {"Designing Data-Intensive Applications", "Distributed Systems", "Martin Fowler", "2016"},
                {"Introduction to the Theory of Computation", "Theory of Computation", "Michael Sipser", "2012"},
                {"Structure and Interpretation of Computer Programs", "Programming Languages", "Gerald Jay Sussman", "1996"},
                {"Companion to Computer Graphics", "Graphics", "John Hennessy", "2015"},
                {"Computer Graphics: Principles and Practice", "Graphics", "Donald E. Knuth", "2018"},
                {"Human-Computer Interaction", "Human-Computer Interaction", "Donald Norman", "2013"},
                {"Designing Interfaces", "Human-Computer Interaction", "Donald Norman", "2014"},
                {"Security Engineering", "Security", "Ross Anderson", "2008"},
                {"Cryptography and Network Security", "Security", "Ronald L. Rivest", "2015"},
                {"Algorithms in Bioinformatics", "Algorithms", "Jon Kleinberg", "2012"},
                {"Programming Pearls", "Programming Languages", "Jon Bentley", "1999"},
                {"Refactoring", "Software Engineering", "Martin Fowler", "2018"},
                {"The Mythical Man-Month", "Software Engineering", "Fred Brooks", "1995"},
                {"Domain-Driven Design", "Software Engineering", "Eric Evans", "2003"},
                {"Clean Code", "Software Engineering", "Robert C. Martin", "2008"},
                {"Design Patterns", "Software Engineering", "Erich Gamma", "1995"},
                {"Programming Language Pragmatics", "Programming Languages", "Michael L. Scott", "2016"},
                {"Database Internals", "Databases", "Alex Petrov", "2019"},
                {"Introduction to Information Retrieval", "Databases", "Christopher Manning", "2008"},
                {"Web Architecture 101", "Cloud Computing", "Tim Berners-Lee", "2010"},
                {"Distributed Systems for Fun and Profit", "Distributed Systems", "Sanjay Ghemawat", "2013"},
                {"Site Reliability Engineering", "DevOps", "Rachel Potvin", "2016"},
                {"The Pragmatic Programmer", "Software Engineering", "Andy Hunt", "1999"},
                {"Cracking the Coding Interview", "Programming Languages", "Gayle Laakmann McDowell", "2015"},
                {"Algorithms Unlocked", "Algorithms", "Thomas H. Cormen", "2013"}
            };

            int isbnCounter = 1000;
            for (String[] sb : sampleBooks) {
                String title = sb[0];
                String categoryName = sb[1];
                String authorName = sb[2];
                int year = Integer.parseInt(sb[3]);

                Author author = savedAuthors.getOrDefault(authorName, null);
                if (author == null) {
                    // fallback: create a lightweight author
                    author = new Author(authorName, "Author of " + title, "Unknown");
                    author = authorRepository.save(author);
                    savedAuthors.put(authorName, author);
                }

                Category cat = savedCategories.getOrDefault(categoryName,
                        new Category(categoryName, categoryName + " resources"));
                if (cat.getId() == null) {
                    cat = categoryRepository.save(cat);
                    savedCategories.put(categoryName, cat);
                }

                String isbn = "978-0-" + isbnCounter++;
                Book book = new Book(title, isbn, "A classic book: " + title, new BigDecimal("39.99"), 10 + (isbnCounter % 20), author, cat);
                book.setPublicationYear(year);
                book.setPages(200 + (isbnCounter % 300));
                book.setLanguage("English");
                booksToSave.add(book);
            }

            // If we have less than 50 books from the sample array, generate additional illustrative books
            while (booksToSave.size() < 50) {
                String genTitle = "Computer Science Essentials Vol. " + (booksToSave.size() + 1);
                String genCategory = categories[booksToSave.size() % categories.length];
                List<Author> authorList = new ArrayList<>(savedAuthors.values());
                Author a = authorList.get(booksToSave.size() % authorList.size());
                Category c = savedCategories.get(genCategory);
                String isbn = "978-0-" + isbnCounter++;
                Book b = new Book(genTitle, isbn, "Introductory text for " + genTitle, new BigDecimal("29.99"), 5 + (booksToSave.size() % 30), a, c);
                b.setPublicationYear(Year.now().getValue() - (booksToSave.size() % 10));
                b.setPages(150 + (booksToSave.size() % 250));
                b.setLanguage("English");
                booksToSave.add(b);
            }

            bookRepository.saveAll(booksToSave);

            System.out.println("DataSeeder: seeded " + savedAuthors.size() + " authors, " + savedCategories.size() + " categories and " + booksToSave.size() + " books.");
            seeded = true;
        } catch (Exception ex) {
            System.err.println("DataSeeder: failed to seed data: " + ex.getMessage());
            ex.printStackTrace();
        }
    }
}
