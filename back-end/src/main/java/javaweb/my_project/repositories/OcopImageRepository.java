package javaweb.my_project.repositories;

import javaweb.my_project.entities.OcopImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OcopImageRepository extends JpaRepository<OcopImage, String> {
}
