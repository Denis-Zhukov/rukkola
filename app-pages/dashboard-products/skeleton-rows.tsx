import {Skeleton, SkeletonText, Table} from "@chakra-ui/react";

export const SkeletonRows = () => (
    <>
        {Array.from({length: 10}).map((_, idx) => (
            <Table.Row key={`skeleton-${idx}`} bg="gray.900" borderBottom="1px solid" borderColor="gray.800">
                {[60, 100, 250, 150, 120, 100].map((w, i) => (
                    <Table.Cell key={i}  p={4}>
                        {i === 0 ? <Skeleton boxSize="60px" borderRadius="md"/> :
                            <SkeletonText noOfLines={2} width={`${w}px`}/>}
                    </Table.Cell>
                ))}
            </Table.Row>
        ))}
    </>
)