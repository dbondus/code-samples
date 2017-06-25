<?php
namespace Task\FeedbackBundle\Util;


class EntityUtils {

    public static function entity2array($entity) {
        $res = array();

        $props = (array)$entity;
        foreach($props as $name => $value) {
            if(strpos($name, "\0") === 0) {
                $name = substr($name, strpos($name, "\0", 1) + 1);
                $getter = 'get' . ucfirst($name);

                is_callable([$entity, $getter]) && ($res[$name] = $entity->$getter());

            } else {
                $res[$name] = $entity->$name;
            }
        }

        return $res;
    }

    public static function array2entity($data, $entity) {
        $props = (array)$entity;
        foreach($props as $name => $value) {
            if(strpos($name, "\0") === 0) {
                $name = substr($name, strpos($name, "\0", 1) + 1);
                if(isset($data[$name])) {
                    $setter = 'set' . ucfirst($name);

                    is_callable([$entity, $setter]) && $entity->$setter($data[$name]);
                }

            } else {
                isset($data[$name]) && ($entity->$name = $data[$name]);
            }
        }

        return $entity;
    }
}