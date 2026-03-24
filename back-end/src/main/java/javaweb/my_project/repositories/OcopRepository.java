package javaweb.my_project.repositories;

import javaweb.my_project.entities.Ocop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OcopRepository extends JpaRepository<Ocop, String> {
}
