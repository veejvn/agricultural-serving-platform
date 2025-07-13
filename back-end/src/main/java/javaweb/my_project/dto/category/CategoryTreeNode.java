package javaweb.my_project.dto.category;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryTreeNode {
    String id;
    String name;
    String parentId;
    Integer level;
    List<CategoryTreeNode> children = new ArrayList<>();
}
